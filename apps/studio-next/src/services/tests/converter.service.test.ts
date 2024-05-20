import { createServices } from '../';

import type { ConverterService } from '../converter.service';

describe('SpecificationService', () => {
  let converterSvc: ConverterService;

  beforeAll(async () => {
    const services = await createServices();
    converterSvc = services.converterSvc;
  });

  describe('.convertSpec', () => {
    test('should convert spec to the given (yaml case)', async () => {
      const result = await converterSvc.convert('asyncapi: 2.0.0', '2.1.0');
      expect(result).toEqual('asyncapi: 2.1.0\n');
    });

    test('should convert spec to the given (json case)', async () => {
      const result = await converterSvc.convert('{"asyncapi": "2.0.0"}', '2.1.0');
      expect(result).toEqual(JSON.stringify({ asyncapi: '2.1.0' }, undefined, 2));
    });

    test('should throw error if converter cannot convert spec - case with invalid version', async () => {
      try {
        await converterSvc.convert('asyncapi: 1.3.0', '2.1.0');
      } catch (e: any) {
        expect(e.message).toEqual('Cannot convert from 1.3.0 to 2.1.0.');
      }
    });
  });
});