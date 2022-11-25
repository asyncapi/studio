import { createServices } from '../';

import type { SpecificationService } from '../specification.service';

describe('SpecificationService', () => {
  let specificationSvc: SpecificationService;

  beforeAll(async () => {
    const services = await createServices();
    specificationSvc = services.specificationSvc;
  });

  describe('.convertSpec', () => {
    test('should convert spec to the given (yaml case)', async () => {
      const result = await specificationSvc.convertSpec('asyncapi: 2.0.0', '2.1.0');
      expect(result).toEqual('asyncapi: 2.1.0\n');
    });

    test('should convert spec to the given (json case)', async () => {
      const result = await specificationSvc.convertSpec('{"asyncapi": "2.0.0"}', '2.1.0');
      expect(result).toEqual(JSON.stringify({ asyncapi: '2.1.0' }, undefined, 2));
    });

    test('should throw error if converter cannot convert spec - case with invalid version', async () => {
      try {
        await specificationSvc.convertSpec('asyncapi: 1.3.0', '2.1.0');
      } catch (e: any) {
        expect(e.message).toEqual('Cannot convert from 1.3.0 to 2.1.0.');
      }
    });
  });

  describe('.shouldInformAboutLatestVersion', () => {
    test('should inform - case with non latest version, 2.1.0', () => {
      sessionStorage.removeItem('informed-about-latest');
      const result = specificationSvc.shouldInformAboutLatestVersion('2.1.0');
      expect(result).toEqual(true);
    });

    test('should not inform - case when `informed-about-latest` is set in session storage', () => {
      sessionStorage.setItem('informed-about-latest', (new Date()).toString());
      const result = specificationSvc.shouldInformAboutLatestVersion('2.1.0');
      // false, because `informed-about-latest` is set to current date
      expect(result).toEqual(false);
    });

    test('should not inform - case when `informed-about-latest` was set the day before', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      sessionStorage.setItem('informed-about-latest', twoDaysAgo.toString());

      const result = specificationSvc.shouldInformAboutLatestVersion('2.1.0');
      // true, because `informed-about-latest` is set two days earlier
      expect(result).toEqual(true);
    });
  });
});