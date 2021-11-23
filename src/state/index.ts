import { appState, useAppState } from './app';
import { editorState, useEditorState } from './editor';
import { parserState, useParserState } from './parser';
import { sidebarState, useSidebarState } from './sidebar';
import { specState, useSpecState } from './spec';
import { templateState, useTemplateState } from './template';

const state = {
  // app
  app: appState,
  useAppState,

  // editor
  editor: editorState,
  useEditorState,

  // parser
  parser: parserState,
  useParserState,

  // sidebar
  sidebar: sidebarState,
  useSidebarState,

  // template
  spec: specState,
  useSpecState,

  // template
  template: templateState,
  useTemplateState,
};

export default state;
