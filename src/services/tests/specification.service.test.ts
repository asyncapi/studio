import { SpecificationService } from '../specification.service';

describe('SpecificationService', () => {
  describe('.convertSpec', () => {
    test('should convert spec to the given (yaml case)', async () => {
      const result = await SpecificationService.convertSpec('asyncapi: 2.0.0', '2.1.0');
      expect(result).toEqual('asyncapi: 2.1.0\n');
    });

    test('should convert spec to the given (json case)', async () => {
      const result = await SpecificationService.convertSpec('{"asyncapi": "2.0.0"}', '2.1.0');
      expect(result).toEqual(JSON.stringify({ asyncapi: "2.1.0" }, undefined, 2));
    });

    test('should throw error if converter cannot convert spec - case with invalid version', async () => {
      // disable console.error only for this test
      jest.spyOn(console, 'error').mockImplementation(jest.fn());

      try {
        await SpecificationService.convertSpec('asyncapi: 1.3.0', '2.1.0')
      } catch (e) {
        expect(e).toEqual({
          error: 'Cannot convert from 1.3.0 to 2.1.0.',
        });
      }
    });
  });

  describe('.shouldInformAboutLatestVersion', () => {
    test('should inform - case with non latest version, 2.1.0', () => {
      sessionStorage.removeItem('informed-about-latest');
      const result = SpecificationService.shouldInformAboutLatestVersion('2.1.0');
      expect(result).toEqual(true);
    });

    test('should not inform - case when `informed-about-latest` is set in session storage', () => {
      sessionStorage.setItem('informed-about-latest', (new Date()).toString())
      const result = SpecificationService.shouldInformAboutLatestVersion('2.1.0');
      // false, because `informed-about-latest` is set to current date
      expect(result).toEqual(false);
    });

    test('should not inform - case when `informed-about-latest` was set the day before', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      sessionStorage.setItem('informed-about-latest', twoDaysAgo.toString())

      const result = SpecificationService.shouldInformAboutLatestVersion('2.1.0');
      // true, because `informed-about-latest` is set two days earlier
      expect(result).toEqual(true);
    });
  });

  describe('.isNotSupportedVersion', () => {
    test('should check unsupported version (yaml case)', () => {
      const result = SpecificationService.isNotSupportedVersion('asyncapi: 1.2.0');
      expect(result).toEqual(true);
    });

    test('should check unsupported version (json case)', () => {
      const result = SpecificationService.isNotSupportedVersion('{"asyncapi": "1.2.0"}');
      expect(result).toEqual(true);
    });

    test('should check supported version (yaml case)', () => {
      const result = SpecificationService.isNotSupportedVersion('asyncapi: 2.0.0');
      expect(result).toEqual(false);
    });

    test('should check supported version (json case)', () => {
      const result = SpecificationService.isNotSupportedVersion('{"asyncapi": "2.0.0"}');
      expect(result).toEqual(false);
    });
  });
});