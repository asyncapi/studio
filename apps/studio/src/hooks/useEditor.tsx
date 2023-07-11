'use client';

import { KeyMod, KeyCode } from 'monaco-editor/esm/vs/editor/editor.api';
import { DiagnosticSeverity } from '@asyncapi/parser/cjs';
import { Range, MarkerSeverity } from 'monaco-editor/esm/vs/editor/editor.api';
import Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import toast from 'react-hot-toast';
import fileDownload from 'js-file-download';

import { documentsState, filesState, settingsState } from '../states';

import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import type { Diagnostic } from '@asyncapi/parser/cjs';
import type { ConvertVersion } from '@asyncapi/converter';
import type { File } from '../states/files.state';
import { useParser, useFormat } from './';

export interface UpdateState {
  content: string;
  updateModel?: boolean;
  sendToServer?: boolean;
  file?: Partial<File>;
} 

export const useEditor = () => {
  let editor: monacoAPI.editor.IStandaloneCodeEditor | undefined;
  let monaco: typeof Monaco | undefined;
  let created = false;  

  const currDecorations: Map<string, string[]> = new Map();
  const fileName = 'asyncapi';

  const { parse } = useParser();
  const { convertToJSON: _convertToJSON, convertToYaml: _convertToYaml, decodeBase64, encodeBase64, retrieveLangauge } = useFormat();

  async function onMount(instance: monacoAPI.editor.IStandaloneCodeEditor, monacoInstance: typeof Monaco) {
    window.MonacoEnvironment!.getWorkerUrl = (
      _moduleId: string,
      label: string
    ) => {
      if (label === "json")
        return "_next/static/json.worker.js";
      if (label === "css")
        return "_next/static/css.worker.js";
      if (label === "html")
        return "_next/static/html.worker.js";
      if (
        label === "typescript" ||
        label === "javascript"
      )
        return "_next/static/ts.worker.js";
      return "_next/static/editor.worker.js";
    }

    monacoInstance.editor.defineTheme('asyncapi-theme', {
      base: 'vs-dark',
      inherit: true,
      colors: {
        'editor.background': '#252f3f',
        'editor.lineHighlightBackground': '#1f2a37',
      },
      rules: [{ token: '', background: '#252f3f' }],
    });

    editor = instance;
    monaco = monacoInstance;

    // parse on first run - only when document is undefined
    const document = documentsState.getState().documents.asyncapi;
    if (!document && editor) {
      await parse('asyncapi', editor?.getValue());
    } else {
      applyMarkersAndDecorations(document.diagnostics.filtered);
    }

    // apply save command
    editor.addCommand(
      KeyMod.CtrlCmd | KeyCode.KeyS,
      () => saveToLocalStorage(),
    );
  };

  function getValue() {
    return editor ? editor.getValue() : '';
  }

  function updateState({
    content,
    updateModel = false,
    sendToServer = true,
    file = {},
  }: UpdateState) {
    const currentContent = filesState.getState().files['asyncapi']?.content;
    if (currentContent === content || typeof content !== 'string') {
      return;
    }

    const language = file.language || retrieveLangauge(content);
    if (!language) {
      return;
    }

    // if (sendToServer) {
    //   svcs.socketClientSvc.send('file:update', { code: content });
    // }

    if (updateModel && editor) {
      const model = editor.getModel();
      if (model) {
        model.setValue(content);
      }
    }

    const { updateFile } = filesState.getState();
    updateFile('asyncapi', {
      language,
      content,
      modified: getFromLocalStorage() !== content,
      ...file,
    });
  }

  // async convertSpec(version?: ConvertVersion | string) {
  //   const converted = await svcs.converterSvc.convert(getValue(), version as ConvertVersion);
  //   updateState({ content: converted, updateModel: true });
  // }

  async function importFromURL(url: string): Promise<void> {
    if (url) {
      return fetch(url)
        .then(res => res.text())
        .then(async text => {
          updateState({ 
            content: text, 
            updateModel: true, 
            file: { 
              source: url, 
              from: 'url' 
            },
          });
        })
        .catch(err => {
          console.error(err);
          throw err;
        });
    }
  }

  async function importFile(files: FileList | null) {
    if (files === null || files?.length !== 1) {
      return;
    }
    const file = files.item(0);
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = fileLoadedEvent => {
      const content = fileLoadedEvent.target?.result;
      updateState({ content: String(content), updateModel: true });
    };
    fileReader.readAsText(file, 'UTF-8');
  }

  async function importBase64(content: string) {
    try {
      const decoded = decodeBase64(content);
      updateState({ 
        content: String(decoded), 
        updateModel: true, 
        file: { 
          from: 'base64', 
          source: undefined, 
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function convertToYaml() {
    try {
      const yamlContent = _convertToYaml(getValue());
      if (yamlContent) {
        updateState({ 
          content: yamlContent, 
          updateModel: true, 
          file: {
            language: 'yaml',
          }
        });
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function convertToJSON() {
    try {
      const jsonContent = _convertToJSON(getValue());
      if (jsonContent) {
        updateState({ 
          content: jsonContent, 
          updateModel: true, 
          file: {
            language: 'json',
          }
        });
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function saveAsYaml() {
    try {
      const yamlContent = _convertToYaml(getValue());
      if (yamlContent) {
        downloadFile(yamlContent, `${fileName}.yaml`);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function saveAsJSON() {
    try {
      const jsonContent = _convertToJSON(getValue());
      if (jsonContent) {
        downloadFile(jsonContent, `${fileName}.json`);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function saveToLocalStorage(editorValue?: string, notify = true) {
    editorValue = editorValue || getValue();
    localStorage.setItem('document', editorValue);

    const { updateFile } = filesState.getState();
    updateFile('asyncapi', {
      from: 'storage',
      source: undefined,
      modified: false,
    });

    if (notify) {
      if (settingsState.getState().editor.autoSaving) {
        toast.success(
          <div>
            <span className="block text-bold">
              Studio is currently saving your work automatically 💪
            </span>
          </div>,
        );
      } else {
        toast.success(
          <div>
            <span className="block text-bold">
              Document succesfully saved to the local storage!
            </span>
          </div>,
        );
      }
    }
  }

  function getFromLocalStorage() {
    return localStorage.getItem('document');
  }

  function applyMarkersAndDecorations(diagnostics: Diagnostic[] = []) {
    const model = editor?.getModel();
    if (!editor || !model || !monaco) {
      return;
    }

    const { markers, decorations } = createMarkersAndDecorations(diagnostics);
    monaco.editor.setModelMarkers(model, 'asyncapi', markers);
    let oldDecorations = currDecorations.get('asyncapi') || [];
    oldDecorations = editor.deltaDecorations(oldDecorations, decorations);
    currDecorations.set('asyncapi', oldDecorations);
  }

  function createMarkersAndDecorations(diagnostics: Diagnostic[] = []) {
    const newDecorations: monacoAPI.editor.IModelDecoration[] = [];
    const newMarkers: monacoAPI.editor.IMarkerData[] = [];

    diagnostics.forEach(diagnostic => {
      const { message, range, severity } = diagnostic;

      if (severity !== DiagnosticSeverity.Error) {
        newDecorations.push({
          id: 'asyncapi',
          ownerId: 0,
          range: new Range(
            range.start.line + 1, 
            range.start.character + 1,
            range.end.line + 1,
            range.end.character + 1
          ),
          options: {
            glyphMarginClassName: getSeverityClassName(severity),
            glyphMarginHoverMessage: { value: message },
          },
        });
        return;
      }
  
      newMarkers.push({
        startLineNumber: range.start.line + 1,
        startColumn: range.start.character + 1,
        endLineNumber: range.end.line + 1,
        endColumn: range.end.character + 1,
        severity: getSeverity(severity),
        message,
      });
    });

    return { decorations: newDecorations, markers: newMarkers };
  }

  function getSeverity(severity: DiagnosticSeverity): monacoAPI.MarkerSeverity {
    switch (severity) {
    case DiagnosticSeverity.Error: return MarkerSeverity.Error;
    case DiagnosticSeverity.Warning: return MarkerSeverity.Warning;
    case DiagnosticSeverity.Information: return MarkerSeverity.Info;
    case DiagnosticSeverity.Hint: return MarkerSeverity.Hint;
    default: return MarkerSeverity.Error;
    }
  }

  function getSeverityClassName(severity: DiagnosticSeverity): string {
    switch (severity) {
    case DiagnosticSeverity.Warning: return 'diagnostic-warning';
    case DiagnosticSeverity.Information: return 'diagnostic-information';
    case DiagnosticSeverity.Hint: return 'diagnostic-hint';
    default: return 'diagnostic-warning';
    }
  }

  function downloadFile(content: string, fileName: string) {
    return fileDownload(content, fileName);
  }

  documentsState.subscribe((state, prevState) => {
    const newDocuments = state.documents;
    const oldDocuments = prevState.documents;

    Object.entries(newDocuments).forEach(([uri, document]) => {
      const oldDocument = oldDocuments[String(uri)];
      if (document === oldDocument) return;
      applyMarkersAndDecorations(document.diagnostics.filtered);
    });
  });

  return {
    created,
    editor,
    convertToJSON,
    convertToYaml,
    downloadFile,
    importFromURL,
    importBase64,
    importFile,
    saveToLocalStorage,
    getFromLocalStorage,
    saveAsJSON,
    saveAsYaml,
    onMount,
  };
}