import { NavigationService } from '../navigation.service';

describe('NavigationService', () => {
  describe('.isReadOnly', () => {
    test('should return false if reaOnly flag is not defined', () => {
      const location = {
        ...window.location,
        search: '?url=some-url.json',
      };
      Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
      });

      const result = NavigationService.isReadOnly();
      expect(result).toEqual(false);
    });

    test('should return true if reaOnly flag is defined - empty value case', () => {
      const location = {
        ...window.location,
        search: '?readOnly',
      };
      Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
      });

      const result = NavigationService.isReadOnly();
      expect(result).toEqual(true);
    });

    test('should return true if reaOnly flag is defined - true value case', () => {
      const location = {
        ...window.location,
        search: '?readOnly=true',
      };
      Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
      });

      const result = NavigationService.isReadOnly();
      expect(result).toEqual(true);
    });

    test('should return false if reaOnly flag is not defined - non empty/true value case', () => {
      const location = {
        ...window.location,
        search: '?readOnly=false',
      };
      Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
      });

      const result = NavigationService.isReadOnly();
      expect(result).toEqual(false);
    });

    test('should return false if reaOnly flag is not defined - strict mode case without other parameters', () => {
      const location = {
        ...window.location,
        search: '?readOnly=true',
      };
      Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
      });

      const result = NavigationService.isReadOnly(true);
      expect(result).toEqual(false);
    });

    test('should return true if reaOnly flag is not defined - strict mode case with url parameter', () => {
      const location = {
        ...window.location,
        search: '?readOnly=true&url=some-url.json',
      };
      Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
      });

      const result = NavigationService.isReadOnly(true);
      expect(result).toEqual(true);
    });

    test('should return true if reaOnly flag is not defined - strict mode case with load parameter', () => {
      const location = {
        ...window.location,
        search: '?readOnly=true&load=some-url.json',
      };
      Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
      });

      const result = NavigationService.isReadOnly(true);
      expect(result).toEqual(true);
    });

    test('should return true if reaOnly flag is not defined - strict mode case with base64 parameter', () => {
      const location = {
        ...window.location,
        search: '?readOnly=true&base64=AsyncAPI',
      };
      Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
      });

      const result = NavigationService.isReadOnly(true);
      expect(result).toEqual(true);
    });
  });
});