import { createServices } from '../';

import type { SettingsService } from '../settings.service';

describe('SettingsService', () => {
  let settingsSvc: SettingsService;

  beforeAll(async () => {
    const services = await createServices();
    settingsSvc = services.settingsSvc;
  });

  describe('.get()', () => {
    test('should return current settings state', () => {
      const state = settingsSvc.get();
      expect(state).toBeDefined();
      expect(typeof state).toBe('object');
      expect(state.governance).toBeDefined();
      expect(state.templates).toBeDefined();
    });
  });

  describe('.set()', () => {
    test('should update settings state', () => {
      settingsSvc.set({
        templates: {
          autoRendering: false,
        },
      });

      const updated = settingsSvc.get();
      expect(updated.templates.autoRendering).toEqual(false);
    });
  });

  describe('.isEqual()', () => {
    test('should return true when comparing identical state', () => {
      const currentState = settingsSvc.get();
      expect(settingsSvc.isEqual(currentState)).toBe(true);
    });

    test('should return false when comparing different state', () => {
      const currentState = settingsSvc.get();
      const modifiedState = {
        ...currentState,
        templates: {
          autoRendering: !currentState.templates.autoRendering,
        },
      };
      expect(settingsSvc.isEqual(modifiedState)).toBe(false);
    });
  });
});
