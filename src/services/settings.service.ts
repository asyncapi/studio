import { AbstractService } from './abstract.service';

import { isDeepEqual } from '../helpers';
import { settingsState } from '../state';

import type { SettingsState } from '../state/settings.state';

export class SettingsService extends AbstractService {
  get(): SettingsState {
    return settingsState.getState();
  }

  set(state: Partial<SettingsState>) {
    const oldSettings = this.get();
    settingsState.setState(state);
    this.svcs.eventsSvc.emit('settings.update', this.get(), oldSettings);
  }

  isEqual(newState: Partial<SettingsState>): boolean {
    return isDeepEqual(this.get(), newState);
  }
}
