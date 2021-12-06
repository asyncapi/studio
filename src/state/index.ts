import { appState, useAppState } from './app';
import { editorState, useEditorState } from './editor';
import { panelsState, usePanelsState } from './panels';
import { parserState, useParserState } from './parser';
import { sidebarState, useSidebarState } from './sidebar';
import { specState, useSpecState } from './spec';

const state = {
  // app
  app: appState,
  useAppState,

  // editor
  editor: editorState,
  useEditorState,

  // panels
  panels: panelsState,
  usePanelsState,

  // parser
  parser: parserState,
  useParserState,

  // sidebar
  sidebar: sidebarState,
  useSidebarState,

  // sidebar
  spec: specState,
  useSpecState,
};

export default state;
