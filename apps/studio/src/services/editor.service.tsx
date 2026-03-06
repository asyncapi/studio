import { AbstractService } from './abstract.service';

import { KeyMod, KeyCode } from 'monaco-editor/esm/vs/editor/editor.api';
import { DiagnosticSeverity } from '@asyncapi/parser';
import { Range, MarkerSeverity } from 'monaco-editor/esm/vs/editor/editor.api';
import toast from 'react-hot-toast';
import fileDownload from 'js-file-download';

import { appState, documentsState, filesState, settingsState } from '@/state';
import { DirectoryHandle, FileHandle } from '@/helpers/file-system-access.types';

import type * as monacoAPI from 'monaco-editor/esm/vs/editor/editor.api';
import type { Diagnostic } from '@asyncapi/parser';
import type { AsyncAPIConvertVersion } from '@asyncapi/converter';
import type { File } from '@/state/files.state';

export interface UpdateState {
  content: string;
  updateModel?: boolean;
  sendToServer?: boolean;
  file?: Partial<File>;
} 

export class EditorService extends AbstractService {
  private created = false;
  private decorations: Map<string, string[]> = new Map();
  private instance: monacoAPI.editor.IStandaloneCodeEditor | undefined;

  override onInit() {
    this.subcribeToDocuments();
  }

  async onDidCreate(editor: monacoAPI.editor.IStandaloneCodeEditor) {
    if (this.created) {
      return;
    }
    this.created = true;
    this.instance = editor;

    // parse on first run - only when document is undefined
    const document = documentsState.getState().documents.asyncapi;
    if (!document) {
      await this.svcs.parserSvc.parse('asyncapi', editor.getValue());
    } else {
      this.applyMarkersAndDecorations(document.diagnostics.filtered);
    }
    
    // apply save command
    editor.addCommand(
      KeyMod.CtrlCmd | KeyCode.KeyS,
      () => this.saveToLocalStorage(),
    );
    
    appState.setState({ initialized: true });
  }

  get editor(): monacoAPI.editor.IStandaloneCodeEditor | undefined {
    return this.instance;
  }

  get value(): string {
    return this.editor?.getModel()?.getValue() as string;
  }

  private getFileNameFromUri(uri: string): string {
    if (!uri) return 'asyncapi';
    const normalized = uri.replace(/\\/g, '/');
    const parts = normalized.split('/');
    return parts[parts.length - 1] || uri;
  }

  private inferLanguageFromUri(uri: string, content?: string): 'json' | 'yaml' {
    const byContent = content ? this.svcs.formatSvc.retrieveLangauge(content) : undefined;
    if (byContent === 'json' || byContent === 'yaml') {
      return byContent;
    }
    const lower = uri.toLowerCase();
    if (lower.endsWith('.json') || lower.endsWith('.avsc')) {
      return 'json';
    }
    return 'yaml';
  }

  private isAsyncApiContent(content: string): boolean {
    const trimmed = String(content || '').trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        return !!parsed?.asyncapi;
      } catch {
        return false;
      }
    }
    return (/^asyncapi\s*:/m).test(trimmed);
  }

  private hasUnsupportedEditorExtension(uri: string): boolean {
    const blocked = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.pdf', '.zip', '.tar', '.gz', '.woff', '.woff2'];
    const path = uri.split('?')[0].toLowerCase();
    return blocked.some((ext) => path.endsWith(ext));
  }

  async switchToFile(uri: string): Promise<void> {
    const { files, setFileTreeLoading, setActiveFile, updateFile } = filesState.getState();
    const target = files[String(uri)];
    if (!target) {
      return;
    }

    if (this.hasUnsupportedEditorExtension(uri)) {
      toast.error('This file type is not supported in the editor.');
      return;
    }

    setFileTreeLoading(true);
    try {
      let content = target.content;
      const fileHandle = target.fileHandle;
      if (!content && fileHandle) {
        const file = await fileHandle.getFile();
        content = await file.text();
      }
      if (!content && (/^https?:\/\//).test(uri)) {
        content = await fetch(uri).then((res) => res.text());
      }

      if (typeof content !== 'string') {
        content = '';
      }

      const language = this.inferLanguageFromUri(uri, content);
      updateFile(uri, {
        content,
        language,
        name: target.name || this.getFileNameFromUri(uri),
        isAsyncApiDocument: this.isAsyncApiContent(content),
        stat: { mtime: Date.now() },
      });
      setActiveFile(uri);
      this.updateState({
        content,
        updateModel: true,
        sendToServer: false,
        file: {
          source: target.source,
          from: target.from,
          language,
          fileHandle,
          directoryHandle: target.directoryHandle,
          localPath: target.localPath,
          name: target.name || this.getFileNameFromUri(uri),
          isAsyncApiDocument: this.isAsyncApiContent(content),
          stat: { mtime: Date.now() },
        },
      });
    } finally {
      setFileTreeLoading(false);
    }
  }

  private async collectLocalProjectFiles(
    directoryHandle: DirectoryHandle,
    basePath = '',
    rootName = directoryHandle.name,
  ): Promise<Record<string, File>> {
    const files: Record<string, File> = {};

    for await (const [, entry] of directoryHandle.entries()) {
      if (entry.kind === 'directory') {
        const childPath = basePath ? `${basePath}/${entry.name}` : entry.name;
        const nested = await this.collectLocalProjectFiles(entry, childPath, rootName);
        Object.assign(files, nested);
      } else if (entry.kind === 'file') {
        const localPath = basePath ? `${basePath}/${entry.name}` : entry.name;
        const fileHandle = entry as FileHandle;
        try {
          const file = await fileHandle.getFile();
          const content = await file.text();
          const language = this.inferLanguageFromUri(localPath, content);
          files[localPath] = {
            uri: localPath,
            name: this.getFileNameFromUri(localPath),
            content,
            from: 'file',
            source: `${rootName}/${localPath}`,
            language,
            modified: false,
            directoryHandle,
            fileHandle,
            localPath,
            isAsyncApiDocument: this.isAsyncApiContent(content),
            stat: { mtime: Date.now() },
          };
        } catch (err) {
          console.error('[DEBUG:editor] Failed to read local file for tree', localPath, err);
        }
      }
    }

    return files;
  }

  updateState({
    content,
    updateModel = false,
    sendToServer = true,
    file = {},
  }: UpdateState) {
    const currentContent = filesState.getState().files['asyncapi']?.content;
    if (currentContent === content || typeof content !== 'string') {
      return;
    }

    const language = file.language || this.svcs.formatSvc.retrieveLangauge(content);
    if (!language) {
      return;
    }

    if (sendToServer) {
      this.svcs.socketClientSvc.send('file:update', { code: content });
    }

    if (updateModel && this.editor) {
      const model = this.editor.getModel();
      if (model) {
        model.setValue(content);
      }
    }

    const { updateFile } = filesState.getState();
    updateFile('asyncapi', {
      language,
      content,
      modified: this.getFromLocalStorage() !== content,
      ...file,
    });
  }

  async convertSpec(version?: AsyncAPIConvertVersion | string) {
    const converted = await this.svcs.converterSvc.convert(this.value, version as AsyncAPIConvertVersion);
    this.updateState({ content: converted, updateModel: true });
  }

  async grantFolderAccess(): Promise<void> {
    const folderAccessToastId = 'folder-access';
    if (!window.isSecureContext) {
      throw new Error('Open Folder requires a secure context (HTTPS or localhost).');
    }
    if (
      typeof window.showDirectoryPicker !== 'function' ||
      typeof window.showOpenFilePicker !== 'function'
    ) {
      throw new Error('This browser context does not support the File System Access API.');
    }
    let directoryHandle: DirectoryHandle;
    try {
      directoryHandle = await window.showDirectoryPicker({ mode: 'read' });
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('[DEBUG:editor] showDirectoryPicker failed', err);
      throw err;
    }

    toast.loading('Please select the AsyncAPI file within the folder...', { id: folderAccessToastId });
    let fileHandle: FileHandle;
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'AsyncAPI files', accept: { 'text/*': ['.yaml', '.yml', '.json'] } }],
        multiple: false,
      });
      fileHandle = handle;
    } catch (err: any) {
      toast.dismiss(folderAccessToastId);
      if (err?.name === 'AbortError') return;
      console.error('[DEBUG:editor] showOpenFilePicker failed', err);
      throw err;
    }

    const pathParts = await directoryHandle.resolve(fileHandle);
    if (!pathParts) {
      toast.dismiss(folderAccessToastId);
      toast.error('Selected file is not within the chosen folder. Please select a file inside the folder.');
      return;
    }

    const localPath = pathParts.join('/');
    const files = await this.collectLocalProjectFiles(directoryHandle);
    const selectedFile = await fileHandle.getFile();
    const selectedContent = await selectedFile.text();
    const selectedLanguage = this.inferLanguageFromUri(localPath, selectedContent);

    files[localPath] = {
      uri: localPath,
      name: this.getFileNameFromUri(localPath),
      content: selectedContent,
      language: selectedLanguage,
      from: 'file',
      source: `${directoryHandle.name}/${localPath}`,
      directoryHandle,
      fileHandle,
      localPath,
      modified: false,
      isAsyncApiDocument: this.isAsyncApiContent(selectedContent),
      stat: { mtime: Date.now() },
    };

    filesState.getState().setProjectFiles(files, {
      activeFileUri: localPath,
      fileTreeMode: 'local',
      projectRoot: directoryHandle.name,
    });

    this.updateState({
      content: selectedContent,
      updateModel: true,
      sendToServer: false,
      file: files[localPath],
    });

    toast.dismiss(folderAccessToastId);
    toast.success('Folder access granted! File references will now be resolved.');
  }
  async importFromURL(url: string): Promise<void> {
    if (!url) {
      throw new Error('URL is required');
    }

    console.log('[DEBUG:editor] importFromURL', url);

    const currentUrl = window.location.href.split('?')[0];
    window.history.pushState({}, '', `${currentUrl}?url=${url}`);

    return fetch(url)
      .then(res => res.text())
      .then(async text => {
        const language = this.inferLanguageFromUri(url, text);
        const projectRoot = (() => {
          try {
            return new URL(url).host;
          } catch {
            return 'Remote Files';
          }
        })();

        const mainFile: File = {
          uri: url,
          name: this.getFileNameFromUri(url),
          content: text,
          from: 'url',
          source: url,
          language,
          modified: false,
          isAsyncApiDocument: this.isAsyncApiContent(text),
          stat: { mtime: Date.now() },
        };

        filesState.getState().setProjectFiles(
          { [url]: mainFile },
          { activeFileUri: url, fileTreeMode: 'remote', projectRoot },
        );

        this.updateState({
          content: text,
          updateModel: true,
          sendToServer: false,
          file: mainFile,
        });
      })
      .catch(err => {
        console.error(err);
        throw err;
      });
  }
  async importFile(files: FileList | null) {
    if (files === null || files?.length !== 1) {
      return;
    }
    const file = files.item(0);
    if (!file) {
      return;
    }

    const allowedExtensions = ['json', 'yaml', 'yml', 'avsc'];
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!allowedExtensions.includes(ext)) {
      throw new Error('Invalid file type. Only .json, .yaml, .yml, and .avsc files are supported.');
    }

    console.log('[DEBUG:editor] importFile', file.name);

    const fileReader = new FileReader();
    fileReader.onload = fileLoadedEvent => {
      const content = String(fileLoadedEvent.target?.result || '');
      const uri = file.name;
      const language = this.inferLanguageFromUri(uri, content);
      const importedFile: File = {
        uri,
        name: file.name,
        content,
        from: 'file',
        source: undefined,
        language,
        modified: false,
        isAsyncApiDocument: this.isAsyncApiContent(content),
        stat: { mtime: Date.now() },
      };

      filesState.getState().setProjectFiles(
        { [uri]: importedFile },
        { activeFileUri: uri, fileTreeMode: 'none', projectRoot: undefined },
      );

      this.updateState({
        content,
        updateModel: true,
        sendToServer: false,
        file: importedFile,
      });
    };
    fileReader.readAsText(file, 'UTF-8');
  }
  async importBase64(content: string) {
    try {
      const decoded = this.svcs.formatSvc.decodeBase64(content);
      const uri = 'base64://document';
      const language = this.inferLanguageFromUri(uri, String(decoded));
      const importedFile: File = {
        uri,
        name: 'Base64 document',
        content: String(decoded),
        from: 'base64',
        source: undefined,
        language,
        modified: false,
        isAsyncApiDocument: this.isAsyncApiContent(String(decoded)),
        stat: { mtime: Date.now() },
      };

      filesState.getState().setProjectFiles(
        { [uri]: importedFile },
        { activeFileUri: uri, fileTreeMode: 'none', projectRoot: undefined },
      );

      this.updateState({
        content: String(decoded),
        updateModel: true,
        sendToServer: false,
        file: importedFile,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async importFromShareID(shareID: string) {
    try {
      const response = await fetch(`/share/${shareID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shared document');
      }

      const data = await response.json();
      const uri = `share://${shareID}`;
      const language = this.inferLanguageFromUri(uri, data.content);
      const importedFile: File = {
        uri,
        name: `Shared ${shareID}`,
        content: data.content,
        from: 'share',
        source: undefined,
        language,
        modified: false,
        isAsyncApiDocument: this.isAsyncApiContent(data.content),
        stat: { mtime: Date.now() },
      };

      filesState.getState().setProjectFiles(
        { [uri]: importedFile },
        { activeFileUri: uri, fileTreeMode: 'none', projectRoot: undefined },
      );

      this.updateState({
        content: data.content,
        updateModel: true,
        sendToServer: false,
        file: importedFile,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async exportAsURL() {
    try {
      const file = filesState.getState().files['asyncapi'];
      const shareID = await fetch('/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: file.content }),
      }).then(res => res.text());
      return `${window.location.origin}/?share=${shareID}`;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async exportAsBase64() {
    try {
      const file = filesState.getState().files['asyncapi'];
      return this.svcs.formatSvc.encodeBase64(file.content);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async convertToYaml() {
    try {
      const yamlContent = this.svcs.formatSvc.convertToYaml(this.value);
      if (yamlContent) {
        this.updateState({ 
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

  async convertToJSON() {
    try {
      const jsonContent = this.svcs.formatSvc.convertToJSON(this.value);
      if (jsonContent) {
        this.updateState({ 
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

  async saveAsYaml() {
    try {
      const yamlContent = this.svcs.formatSvc.convertToYaml(this.value);
      if (yamlContent) {
        this.downloadFile(yamlContent, `${this.fileName}.yaml`);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async saveAsJSON() {
    try {
      const jsonContent = this.svcs.formatSvc.convertToJSON(this.value);
      if (jsonContent) {
        this.downloadFile(jsonContent, `${this.fileName}.json`);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  saveToLocalStorage(editorValue?: string, notify = true) {
    editorValue = editorValue || this.value;

    // Get current source URL to preserve it
    const currentFile = filesState.getState().files['asyncapi'];
    const source = currentFile?.source;

    // Store both content and source in localStorage
    const documentData = {
      content: editorValue,
      source: source || undefined,
    };
    localStorage.setItem('document', JSON.stringify(documentData));

    const { updateFile } = filesState.getState();
    updateFile('asyncapi', {
      source, // Preserve the source URL
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

  getFromLocalStorage() {
    const stored = localStorage.getItem('document');
    if (!stored) return null;

    try {
      // Try to parse as JSON (new format)
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && 'content' in parsed) {
        return parsed.content; // Return just the content for compatibility
      }
    } catch {
      // If parsing fails, it's the old format (plain string)
      return stored;
    }

    // Fallback to treating as plain string
    return stored;
  }

  getSourceFromLocalStorage() {
    const stored = localStorage.getItem('document');
    if (!stored) return undefined;

    try {
      // Try to parse as JSON (new format)
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && 'source' in parsed) {
        return parsed.source;
      }
    } catch {
      // If parsing fails, it's the old format (no source)
      return undefined;
    }

    return undefined;
  }

  private applyMarkersAndDecorations(diagnostics: Diagnostic[] = []) {
    const editor = this.editor;
    const model = editor?.getModel();
    const monaco = this.svcs.monacoSvc.monaco;

    if (!editor || !model || !monaco) {
      return;
    }

    const { markers, decorations } = this.createMarkersAndDecorations(diagnostics);
    monaco.editor.setModelMarkers(model, 'asyncapi', markers);
    let oldDecorations = this.decorations.get('asyncapi') || [];
    oldDecorations = editor.deltaDecorations(oldDecorations, decorations);
    this.decorations.set('asyncapi', oldDecorations);
  }

  createMarkersAndDecorations(diagnostics: Diagnostic[] = []) {
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
            glyphMarginClassName: this.getSeverityClassName(severity),
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
        severity: this.getSeverity(severity),
        message,
      });
    });

    return { decorations: newDecorations, markers: newMarkers };
  }

  private getSeverity(severity: DiagnosticSeverity): monacoAPI.MarkerSeverity {
    switch (severity) {
    case DiagnosticSeverity.Error: return MarkerSeverity.Error;
    case DiagnosticSeverity.Warning: return MarkerSeverity.Warning;
    case DiagnosticSeverity.Information: return MarkerSeverity.Info;
    case DiagnosticSeverity.Hint: return MarkerSeverity.Hint;
    default: return MarkerSeverity.Error;
    }
  }

  private getSeverityClassName(severity: DiagnosticSeverity): string {
    switch (severity) {
    case DiagnosticSeverity.Warning: return 'diagnostic-warning';
    case DiagnosticSeverity.Information: return 'diagnostic-information';
    case DiagnosticSeverity.Hint: return 'diagnostic-hint';
    default: return 'diagnostic-warning';
    }
  }

  private fileName = 'asyncapi';
  private downloadFile(content: string, fileName: string) {
    return fileDownload(content, fileName);
  }

  private subcribeToDocuments() {
    documentsState.subscribe((state, prevState) => {
      const newDocuments = state.documents;
      const oldDocuments = prevState.documents;

      Object.entries(newDocuments).forEach(([uri, document]) => {
        const oldDocument = oldDocuments[String(uri)];
        if (document === oldDocument) return;
        this.applyMarkersAndDecorations(document.diagnostics.filtered);
      });
    });
  }
}

