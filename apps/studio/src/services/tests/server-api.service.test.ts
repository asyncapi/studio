import { createServices } from '../';

import type { ServerAPIService } from '../server-api.service';

jest.mock('js-file-download', () => jest.fn());

function createMockResponse(body: any, init: { status: number; headers?: Record<string, string> } = { status: 200 }) {
  const textContent = typeof body === 'string' ? body : JSON.stringify(body);
  return {
    ok: init.status >= 200 && init.status < 300,
    status: init.status,
    headers: init.headers || {},
    text: async () => textContent,
    json: async () => (typeof body === 'string' ? JSON.parse(body) : body),
    blob: async () => ({ text: async () => textContent }),
  } as unknown as Response;
}

describe('ServerAPIService', () => {
  let serverAPISvc: ServerAPIService;
  const originalFetch = globalThis.fetch;

  beforeAll(async () => {
    const services = await createServices();
    serverAPISvc = services.serverAPISvc;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('.retrieveProblem()', () => {
    test('should return null for successful response (status 200)', async () => {
      const response = createMockResponse({ success: true }, { status: 200 });

      const problem = await serverAPISvc.retrieveProblem(response);
      expect(problem).toBeNull();
    });

    test('should return parsed problem object for error response (status 400)', async () => {
      const errorBody = {
        type: 'https://api.asyncapi.com/problems/invalid-spec',
        title: 'Invalid AsyncAPI document',
        status: 400,
        detail: 'Document has syntax error at line 5',
      };

      const response = createMockResponse(errorBody, { status: 400 });

      const problem = await serverAPISvc.retrieveProblem(response);
      expect(problem).toEqual(errorBody);
    });

    test('should return parsed problem object for error response (status 500)', async () => {
      const errorBody = {
        type: 'https://api.asyncapi.com/problems/internal-server-error',
        title: 'Internal Server Error',
        status: 500,
      };

      const response = createMockResponse(errorBody, { status: 500 });

      const problem = await serverAPISvc.retrieveProblem(response);
      expect(problem).toEqual(errorBody);
    });
  });

  describe('.generate()', () => {
    test('should send POST request to /generate endpoint', async () => {
      const mockResponse = createMockResponse('mock-zip-content', { status: 200 });
      const fetchMock = jest.fn().mockResolvedValue(mockResponse as any);
      globalThis.fetch = fetchMock;

      const requestPayload = {
        asyncapi: 'asyncapi: 3.0.0',
        template: '@asyncapi/html-template',
        parameters: { version: '1.0.0' },
      };

      const res = await serverAPISvc.generate(requestPayload);

      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.asyncapi.com/v1/generate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
        }),
      );
      expect(res.status).toEqual(200);
    });
  });
});
