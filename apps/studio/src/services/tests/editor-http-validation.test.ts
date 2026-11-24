import { createServices } from '../';

import type { EditorService } from '../editor.service';

// Mock global fetch
const originalFetch = globalThis.fetch;

describe('EditorService - HTTP response validation', () => {
  let editorSvc: EditorService;

  beforeAll(async () => {
    const services = await createServices();
    editorSvc = services.editorSvc;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('.importFromURL', () => {
    test('should throw an error when fetch returns 404', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: jest.fn().mockResolvedValue('<html>Not Found</html>'),
      });

      const url = 'https://example.com/nonexistent.yaml';
      await expect(editorSvc.importFromURL(url)).rejects.toThrow(
        `Failed to fetch ${url}: 404 Not Found`,
      );
    });

    test('should throw an error when fetch returns 500', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: jest.fn().mockResolvedValue('Server Error'),
      });

      const url = 'https://example.com/broken.yaml';
      await expect(editorSvc.importFromURL(url)).rejects.toThrow(
        `Failed to fetch ${url}: 500 Internal Server Error`,
      );
    });

    test('should not throw when fetch returns 200', async () => {
      const validContent = 'asyncapi: 2.6.0\ninfo:\n  title: Test\n  version: 1.0.0';
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: jest.fn().mockResolvedValue(validContent),
      });

      const url = 'https://example.com/valid.yaml';
      // Should not throw
      await expect(editorSvc.importFromURL(url)).resolves.not.toThrow();
    });
  });
});
