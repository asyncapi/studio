import { appState, useAppState } from './app.state';
import { documentsState, useDocumentsState } from './documents.state';
import { filesState, useFilesState } from './files.state';
import { panelsState, usePanelsState } from './panels.state';
import { settingsState, useSettingsState } from './settings.state';

export { 
  appState, useAppState,
  documentsState, useDocumentsState,
  filesState, useFilesState,
  panelsState, usePanelsState,
  settingsState, useSettingsState,
};

const state = {
  // app
  app: appState,
  useAppState,

  // documents
  documents: documentsState,
  useDocumentsState,

  // file-system
  files: filesState,
  useFilesState,

  // panels
  panels: panelsState,
  usePanelsState,

  // settings
  settings: settingsState,
  useSettingsState,
};

export default state;