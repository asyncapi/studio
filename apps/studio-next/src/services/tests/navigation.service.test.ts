import { createServices } from '../';

import type { NavigationService } from '../navigation.service';

describe('NavigationService', () => {
  let navigationSvc: NavigationService;

  beforeAll(async () => {
    const services = await createServices();
    navigationSvc = services.navigationSvc;
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

  describe('.getUrlParameters() - checking readOnly parameter', () => {
    test('should return false if reaOnly flag is not defined', () => {
      updateLocation('?url=some-url.json');
      const result = navigationSvc.getUrlParameters();
      expect(result.readOnly).toEqual(false);
    });

    test('should return true if reaOnly flag is defined - empty value case', () => {
      updateLocation('?readOnly');
      const result = navigationSvc.getUrlParameters();
      expect(result.readOnly).toEqual(true);
    });

    test('should return true if reaOnly flag is defined - true value case', () => {
      updateLocation('?readOnly=true');
      const result = navigationSvc.getUrlParameters();
      expect(result.readOnly).toEqual(true);
    });

    test('should return false if reaOnly flag is not defined - non empty/true value case', () => {
      updateLocation('?readOnly=false');
      const result = navigationSvc.getUrlParameters();
      expect(result.readOnly).toEqual(false);
    });
  });
});
