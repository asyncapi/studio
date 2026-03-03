/**
 * Local File Resolver for AsyncAPI Parser (Stage 2/3)
 *
 * Resolves local $ref paths by navigating the folder granted via the
 * File System Access API (window.showDirectoryPicker).
 */

/**
 * Normalise a relative reference path against the base file path.
 *
 * Examples:
 *   normaliseRelativePath('asyncapi.yaml', 'apis/schema.avsc')  → 'apis/schema.avsc'
 *   normaliseRelativePath('specs/api.yaml', '../schemas/user.avsc') → 'schemas/user.avsc'
 *   normaliseRelativePath('specs/api.yaml', './types.json') → 'specs/types.json'
 */
export function normaliseRelativePath(basePath: string, relativePath: string): string {
  // Start from the directory of the base file
  const baseParts = basePath.split('/');
  baseParts.pop(); // remove the filename, keep only directory segments

  const refParts = relativePath.split('/');

  for (const part of refParts) {
    if (part === '..') {
      baseParts.pop();
    } else if (part !== '.') {
      baseParts.push(part);
    }
  }

  const resolved = baseParts.join('/');
  console.log('[DEBUG:resolver] normaliseRelativePath', { basePath, relativePath, resolved });
  return resolved;
}

/**
 * Navigate the directory tree to find the file at `filePath` (relative to `directoryHandle`).
 * Returns the FileSystemFileHandle for the target file.
 *
 * Throws descriptive errors if intermediate directories or the final file are not found.
 */
export async function getFileHandleFromPath(
  directoryHandle: FileSystemDirectoryHandle,
  filePath: string,
): Promise<FileSystemFileHandle> {
  const parts = filePath.split('/').filter(Boolean);
  const fileName = parts.pop();

  if (!fileName) {
    throw new Error(`Invalid file path: "${filePath}"`);
  }

  let currentDir = directoryHandle;

  for (const dirName of parts) {
    try {
      console.log('[DEBUG:resolver] getFileHandleFromPath navigating to dir:', dirName);
      currentDir = await currentDir.getDirectoryHandle(dirName);
    } catch {
      throw new Error(
        `Directory not found: "${dirName}" in path "${filePath}". ` +
        'Make sure the selected folder contains this directory.',
      );
    }
  }

  try {
    console.log('[DEBUG:resolver] getFileHandleFromPath getting file:', fileName);
    return await currentDir.getFileHandle(fileName);
  } catch {
    throw new Error(
      `File not found: "${fileName}" in path "${filePath}". ` +
      'Make sure the file exists in the selected folder.',
    );
  }
}

export interface LocalFileResolverOptions {
  directoryHandle: FileSystemDirectoryHandle;
  /** Relative path of the main AsyncAPI file within the folder, e.g. "asyncapi.yaml" or "specs/api.yaml" */
  basePath: string;
}

/**
 * Extract a usable path string from a urijs Uri object or a plain string.
 */
function extractPath(uri: any): string {
  if (typeof uri === 'string') return uri;
  // urijs Uri objects expose .path() as a method
  if (typeof uri.path === 'function') return uri.path();
  // fallback: toString() and strip protocol
  return String(uri).replace(/^file:\/\/\/?/, '');
}

/**
 * Returns a resolver object compatible with the AsyncAPI parser's
 * `__unstable.resolver.resolvers` option.
 *
 * The resolver uses `schema: 'file'` so the parser dispatches `file://` URIs
 * to it, and `order: 1` so it runs before the default Node.js file resolver
 * (which would fail in the browser with "readFile is not a function").
 */
export function createLocalFileResolver(options: LocalFileResolverOptions) {
  const { directoryHandle, basePath } = options;
  // The source passed to the parser is `folderName/localPath` (e.g. "apis/asyncapi.yml").
  // The parser resolves $refs relative to that source, producing paths like
  // "apis/schemas/User.avsc".  We need to strip the folder name prefix to get
  // the path relative to the directoryHandle (e.g. "schemas/User.avsc").
  const folderPrefix = directoryHandle.name + '/';

  console.log('[DEBUG:resolver] createLocalFileResolver created', { basePath, folderName: directoryHandle.name, folderPrefix });

  return {
    schema: 'file' as const,
    order: 1,

    canRead(uri: any) {
      const p = extractPath(uri);
      console.log('[DEBUG:resolver] canRead called for', p, '(raw uri:', String(uri), ')');
      return true; // Accept all file:// URIs — we handle everything in this folder
    },

    async read(uri: any): Promise<string> {
      const rawPath = extractPath(uri);
      console.log('[DEBUG:resolver] read() called for', rawPath, '(raw uri:', String(uri), ')');

      // Strip leading slashes and the folder name prefix to get a path
      // relative to the directoryHandle.
      let relativePath = rawPath.replace(/^\/+/, '');
      if (relativePath.startsWith(folderPrefix)) {
        relativePath = relativePath.slice(folderPrefix.length);
      }

      console.log('[DEBUG:resolver] read() relativePath:', relativePath);
      const fileHandle = await getFileHandleFromPath(directoryHandle, relativePath);
      const file = await fileHandle.getFile();
      const content = await file.text();
      console.log('[DEBUG:resolver] read() success for', relativePath, `(${content.length} chars)`);
      return content;
    },
  };
}

