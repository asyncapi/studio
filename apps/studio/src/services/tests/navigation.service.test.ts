import { createServices } from '../';
import { filesState } from '@/state';

import type { NavigationService } from '../navigation.service';

describe('NavigationService', () => {
  let navigationSvc: NavigationService;

  beforeAll(async () => {
    const services = await createServices();
    navigationSvc = services.navigationSvc;
  });

  afterAll(() => {
    navigationSvc.destroy();
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  function updateLocation(search: string) {
    window.history.replaceState({}, '', `/${search}`);
  }

  function updateHref(pathAndQueryAndHash: string) {
    window.history.replaceState({}, '', pathAndQueryAndHash);
  }

  function transitionSource(from: 'storage' | 'url' | 'base64' | 'share' | 'file', to: 'storage' | 'url' | 'base64' | 'share' | 'file') {
    const { updateFile } = filesState.getState();
    updateFile('asyncapi', { from, stat: { mtime: Date.now() } });
    updateFile('asyncapi', { from: to, stat: { mtime: Date.now() + 1 } });
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

  describe('query cleanup on source transitions', () => {
    test('removes `url` when leaving remote source', () => {
      updateHref('/?url=https://a.com/spec.yaml&readOnly=true');

      transitionSource('url', 'file');

      expect(window.location.search).toEqual('?readOnly=true');
    });

    test('removes legacy `load` when leaving remote source', () => {
      updateHref('/?load=https://a.com/spec.yaml&previewServer=x');

      transitionSource('url', 'base64');

      expect(window.location.search).toEqual('?previewServer=x');
    });

    test('removes both `url` and `load` if both are present', () => {
      updateHref('/?url=a&load=b&x=1');

      transitionSource('url', 'share');

      expect(window.location.search).toEqual('?x=1');
    });

    test('preserves hash when cleaning query params', () => {
      updateHref('/?url=a&x=1#section-2');

      transitionSource('url', 'file');

      expect(window.location.search).toEqual('?x=1');
      expect(window.location.hash).toEqual('#section-2');
    });

    test('does not cleanup when source remains url', () => {
      updateHref('/?url=a&x=1');

      transitionSource('url', 'url');

      expect(window.location.search).toEqual('?url=a&x=1');
    });

    test('does not cleanup on non-url transitions', () => {
      updateHref('/?url=a&x=1');

      transitionSource('file', 'share');

      expect(window.location.search).toEqual('?url=a&x=1');
    });
  });
});
