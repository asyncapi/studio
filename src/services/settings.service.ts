import { AbstractService } from './abstract.service';

import { isDeepEqual } from '../helpers';
import { settingsState } from '../state';

import type { SettingsState } from '../state/settings.state';

export class SettingsService extends AbstractService {
  get(): SettingsState {
    return settingsState.getState();
  }

  set(state: Partial<SettingsState>) {
    settingsState.setState(state);
  }

  isEqual(newState: Partial<SettingsState>): boolean {
    return isDeepEqual(this.get(), newState);
  }
}