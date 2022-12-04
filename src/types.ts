import type specs from '@asyncapi/specs';

import type { Document } from './state/documents.state';
import type { File, Directory } from './state/files.state';
import type { Panel, PanelTab } from './state/panels.state';
import type { SettingsState } from './state/settings.state';

export type SpecVersions = keyof typeof specs;

export interface EventKinds {
  /**
   * AsyncAPI Documents events
   */
  'documents.document.create': (document: Document) => void;
  'documents.document.update': (document: Document) => void;
  'documents.document.remove': (document: Document) => void;

  /**
   * File system events
   */
  'fs.file.create': (file: File) => void;
  'fs.file.update': (file: File) => void;
  'fs.file.remove': (file: File) => void;
  'fs.directory.create': (directory: Directory) => void;
  'fs.directory.update': (directory: Directory) => void;
  'fs.directory.remove': (directory: Directory) => void;

  /**
   * Panels events
   */
  'panels.panel.add': (panel: Panel) => void;
  'panels.panel.update': (panel: Panel) => void;
  'panels.panel.remove': (panel: Panel) => void;
  'panels.panel.set-active-tab': (panel: Panel) => void;
  'panels.tab.add': (tab: PanelTab) => void;
  'panels.tab.update': (tab: PanelTab) => void;
  'panels.tab.remove': (tab: PanelTab) => void;

  /**
   * Settings events
   */
  'settings.update': (settings: SettingsState, prevSettings: SettingsState) => void;
}
