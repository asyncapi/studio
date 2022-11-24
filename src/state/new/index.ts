import { appState, useAppState } from './app.state';
import { documentsState, useDocumentsState } from './documents.state';
import { panelsState, usePanelsState } from './panels.state';
import { settingsState, useSettingsState } from './settings.state';

const state = {
  // app
  app: appState,
  useAppState,

  // panels
  panels: panelsState,
  usePanelsState,

  // settings
  settings: settingsState,
  useSettingsState,

  // spec
  documents: documentsState,
  useDocumentsState,
};

export default state;
