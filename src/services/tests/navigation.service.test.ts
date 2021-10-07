import { NavigationService } from '../navigation.service';

describe('NavigationService', () => {
  describe('.isReadOnly', () => {
    test('should return false if reaOnly flag is not defined', () => {
      updateLocation('?url=some-url.json');
      const result = NavigationService.isReadOnly();
      expect(result).toEqual(false);
    });

    test('should return true if reaOnly flag is defined - empty value case', () => {
      updateLocation('?readOnly');
      const result = NavigationService.isReadOnly();
      expect(result).toEqual(true);
    });

    test('should return true if reaOnly flag is defined - true value case', () => {
      updateLocation('?readOnly=true');
      const result = NavigationService.isReadOnly();
      expect(result).toEqual(true);
    });

    test('should return false if reaOnly flag is not defined - non empty/true value case', () => {
      updateLocation('?readOnly=false');
      const result = NavigationService.isReadOnly();
      expect(result).toEqual(false);
    });

    test('should return false if reaOnly flag is not defined - strict mode case without other parameters', () => {
      updateLocation('?readOnly=true');
      const result = NavigationService.isReadOnly(true);
      expect(result).toEqual(false);
    });

    test('should return true if reaOnly flag is not defined - strict mode case with url parameter', () => {
      updateLocation('?readOnly=true&url=some-url.json');
      const result = NavigationService.isReadOnly(true);
      expect(result).toEqual(true);
    });

    test('should return true if reaOnly flag is not defined - strict mode case with load parameter', () => {
      updateLocation('?readOnly=true&load=some-url.json');
      const result = NavigationService.isReadOnly(true);
      expect(result).toEqual(true);
    });

    test('should return true if reaOnly flag is not defined - strict mode case with base64 parameter', () => {
      updateLocation('?readOnly=true&base64=AsyncAPI');
      const result = NavigationService.isReadOnly(true);
      expect(result).toEqual(true);
    });
  });
});

function updateLocation(search: string) {
  const location = {
    ...window.location,
    search,
  };
  Object.defineProperty(window, 'location', {
    writable: true,
    value: location,
  });
}
