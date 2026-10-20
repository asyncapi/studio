import { createServices } from '../';

import type { SettingsService } from '../settings.service';
import type { SettingsState } from '@/state/settings.state';

describe('SettingsService', () => {
  let settingsSvc: SettingsService;

  const defaultState: SettingsState = {
    governance: {
      show: {
        warnings: true,
        informations: true,
        hints: true,
      },
    },
    templates: {
      autoRendering: true,
    },
  };

  beforeAll(async () => {
    const services = await createServices();
    settingsSvc = services.settingsSvc;
  });

  afterEach(() => {
    // Reset to default settings state after each test
    settingsSvc.set(defaultState);
  });

  describe('.get', () => {
    test('should return current settings state', () => {
      const state = settingsSvc.get();
      expect(state).toEqual(defaultState);
    });

    test('should have expected governance properties', () => {
      const state = settingsSvc.get();
      expect(state.governance).toBeDefined();
      expect(state.governance.show.warnings).toBe(true);
      expect(state.governance.show.informations).toBe(true);
      expect(state.governance.show.hints).toBe(true);
    });

    test('should have expected templates properties', () => {
      const state = settingsSvc.get();
      expect(state.templates).toBeDefined();
      expect(state.templates.autoRendering).toBe(true);
    });
  });

  describe('.set', () => {
    test('should partially update templates state', () => {
      settingsSvc.set({
        templates: {
          autoRendering: false,
        },
      });

      const updated = settingsSvc.get();
      expect(updated.templates.autoRendering).toBe(false);
      expect(updated.governance.show.warnings).toBe(true);
    });

    test('should partially update governance state', () => {
      settingsSvc.set({
        governance: {
          show: {
            warnings: false,
            informations: false,
            hints: false,
          },
        },
      });

      const updated = settingsSvc.get();
      expect(updated.governance.show.warnings).toBe(false);
      expect(updated.governance.show.informations).toBe(false);
      expect(updated.governance.show.hints).toBe(false);
      expect(updated.templates.autoRendering).toBe(true);
    });
  });

  describe('.isEqual', () => {
    test('should return true for identical state', () => {
      const current = settingsSvc.get();
      expect(settingsSvc.isEqual(current)).toBe(true);
    });

    test('should return false when compared with different state', () => {
      const differentState: SettingsState = {
        governance: {
          show: {
            warnings: false,
            informations: true,
            hints: true,
          },
        },
        templates: {
          autoRendering: true,
        },
      };

      expect(settingsSvc.isEqual(differentState)).toBe(false);
    });

    test('should return false when templates autoRendering differs', () => {
      const differentState: SettingsState = {
        ...defaultState,
        templates: {
          autoRendering: false,
        },
      };

      expect(settingsSvc.isEqual(differentState)).toBe(false);
    });
  });
});
