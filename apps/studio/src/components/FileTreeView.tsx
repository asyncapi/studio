import React, { useMemo, useState } from 'react';
import { VscChevronDown, VscChevronRight, VscFile, VscFolder, VscFolderOpened, VscGlobe } from 'react-icons/vsc';

import { useServices } from '@/services';
import { useFilesState } from '@/state';

type TreeNode = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  uri?: string;
  title?: string;
  isRemoteGroup?: boolean;
  children?: TreeNode[];
};

type TreeEntry = {
  key: string;
  path: string;
  uri: string;
  title?: string;
};

function buildTree(entries: TreeEntry[]): TreeNode[] {
  type RawNode = TreeNode & { childrenMap: Record<string, RawNode> };
  const root: Record<string, RawNode> = {};

  for (const entry of entries) {
    const parts = entry.path.split('/').filter(Boolean);
    if (parts.length === 0) continue;

    let level = root;
    let currentPath = '';
    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = index === parts.length - 1;
      if (!level[part]) {
        level[part] = {
          name: part,
          path: `${entry.key}:${currentPath}`,
          type: isFile ? 'file' : 'folder',
          uri: isFile ? entry.uri : undefined,
          title: isFile ? entry.title : undefined,
          children: isFile ? undefined : [],
          childrenMap: {},
        };
      }
      if (!isFile) {
        level[part].type = 'folder';
        level = level[part].childrenMap;
      }
    });
  }

  const normalize = (map: Record<string, RawNode>): TreeNode[] =>
    Object.values(map)
      .map((node) => {
        const { childrenMap, ...rest } = node;
        return {
          ...rest,
          children: Object.keys(childrenMap).length > 0 ? normalize(childrenMap) : undefined,
        };
      })
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

  return normalize(root);
}

function getFileTypeColor(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) return 'text-blue-400';
  if (lower.endsWith('.json')) return 'text-yellow-400';
  if (lower.endsWith('.avsc')) return 'text-green-400';
  if (lower.endsWith('.md') || lower.endsWith('.markdown')) return 'text-purple-400';
  return 'text-gray-300';
}

function truncateExternalUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const fileName = parts[parts.length - 1] || parsed.host;
    return `${parsed.protocol}//.../${fileName}`;
  } catch {
    return url.length > 32 ? `${url.slice(0, 16)}...${url.slice(-12)}` : url;
  }
}

function formatRemoteGroupLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.host;
    const port = parsed.port;
    const fullhost = port ? `${host}:${port}` : host;
    const parts = parsed.pathname.split('/').filter(Boolean);
    const tail = parts.length > 0 ? parts[parts.length - 1] : parsed.host;
    return `${parsed.protocol}//${fullhost}/.../${tail}/`;
  } catch {
    return truncateExternalUrl(url);
  }
}

export const FileTreeView: React.FC = () => {
  const { editorSvc } = useServices();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const { files, activeFileUri, fileTreeMode, projectRoot, fileTreeLoading } = useFilesState((state) => ({
    files: state.files,
    activeFileUri: state.activeFileUri,
    fileTreeMode: state.fileTreeMode,
    projectRoot: state.projectRoot,
    fileTreeLoading: state.fileTreeLoading,
  }));

  const projectFiles = useMemo(
    () => Object.entries(files).filter(([uri]) => uri !== 'asyncapi').map(([, file]) => file).sort((a, b) => a.uri.localeCompare(b.uri)),
    [files],
  );

  const activeFile = useMemo(() => files['asyncapi'], [files]);

  const localTree = useMemo(
    () =>
      buildTree(
        projectFiles.map((file) => ({
          key: 'local',
          path: file.uri,
          uri: file.uri,
        })),
      ),
    [projectFiles],
  );

  const remoteTree = useMemo(() => {
    const remoteFiles = projectFiles.filter((file) => (/^https?:\/\//).test(file.uri));
    const mainRemote = remoteFiles.find((file) => file.isAsyncApiDocument) || remoteFiles[0];
    const baseDir = (() => {
      if (!mainRemote) return undefined;
      try {
        return new URL('.', mainRemote.uri).href;
      } catch {
        return undefined;
      }
    })();

    const baseEntries: TreeEntry[] = [];
    const groups = new Map<string, TreeNode>();

    for (const file of remoteFiles) {
      if (baseDir && file.uri.startsWith(baseDir)) {
        baseEntries.push({
          key: 'remote-base',
          path: file.uri.slice(baseDir.length),
          uri: file.uri,
        });
        continue;
      }

      let baseUrl = file.uri;
      let fileName = file.uri;

      try {
        const parsed = new URL(file.uri);
        baseUrl = new URL('.', parsed.href).href;
        const parts = parsed.pathname.split('/').filter(Boolean);
        fileName = parts[parts.length - 1] || parsed.host;
      } catch {
        fileName = truncateExternalUrl(file.uri);
      }

      const groupPath = `remote-group:${baseUrl}`;
      if (!groups.has(baseUrl)) {
        groups.set(baseUrl, {
          name: formatRemoteGroupLabel(baseUrl),
          path: groupPath,
          type: 'folder',
          title: baseUrl,
          isRemoteGroup: true,
          children: [],
        });
      }

      const group = groups.get(baseUrl);
      group?.children?.push({
        name: fileName,
        path: `${groupPath}/${fileName}`,
        type: 'file',
        uri: file.uri,
        title: file.uri,
      });
    }

    const groupedNodes = Array.from(groups.values())
      .map((group) => ({
        ...group,
        children: group.children?.slice().sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const baseNodes = buildTree(baseEntries);
    const baseFolders = baseNodes.filter((node) => node.type === 'folder');
    const baseFiles = baseNodes.filter((node) => node.type === 'file');

    return [...groupedNodes, ...baseFolders, ...baseFiles];
  }, [projectFiles]);

  const renderNode = (node: TreeNode) => {
    if (node.type === 'folder') {
      const isExpanded = expandedFolders[node.path] ?? true;
      const isRemoteGroup = !!node.isRemoteGroup || node.path.startsWith('remote-group:');
      return (
        <div key={node.path}>
          <button
            type="button"
            className="w-full flex items-center px-2 py-1 text-left text-xs text-gray-200 hover:bg-gray-900"
            onClick={() => setExpandedFolders((prev) => ({ ...prev, [node.path]: !isExpanded }))}
            title={isRemoteGroup ? node.title : undefined}
          >
            {isExpanded ? <VscChevronDown className="mr-1" /> : <VscChevronRight className="mr-1" />}
            {isRemoteGroup ? (
              <VscGlobe className="mr-1 text-blue-400" />
            ) : (
              <>{isExpanded ? <VscFolderOpened className="mr-1 text-yellow-400" /> : <VscFolder className="mr-1 text-yellow-400" />}</>
            )}
            <span className="truncate">{node.name}</span>
          </button>
          {isExpanded && node.children && <div className="pl-3 border-l border-gray-700">{node.children.map((child) => renderNode(child))}</div>}
        </div>
      );
    }

    const fileUri = node.uri || node.path;
    const isActive = activeFileUri === fileUri || activeFile?.uri === fileUri;
    return (
      <button
        key={node.path}
        type="button"
        disabled={fileTreeLoading}
        onClick={() => editorSvc.switchToFile(fileUri)}
        className={`w-full flex items-center px-2 py-1 text-left text-xs ${
          isActive ? 'bg-pink-900/40 border-l-2 border-pink-500 text-white' : 'text-gray-200 hover:bg-gray-900'
        } ${fileTreeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={node.title}
      >
        <VscFile className={`mr-1 ${getFileTypeColor(node.name)}`} />
        <span className="truncate">{node.name}</span>
      </button>
    );
  };

  if (fileTreeMode === 'none') {
    return null;
  }

  const treeNodes = fileTreeMode === 'local' ? localTree : remoteTree;

  return (
    <div className="mb-4 border border-gray-700 bg-gray-800 rounded">
      <button
        type="button"
        className="w-full flex items-center justify-between px-2 py-2 text-left text-white text-base border-b border-gray-700"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <span>
          {fileTreeMode === 'local' ? 'Local Files' : 'Remote Files'}
          {projectRoot ? ` • ${projectRoot}` : ''}
        </span>
        {collapsed ? <VscChevronRight /> : <VscChevronDown />}
      </button>
      {!collapsed && (
        <div className="max-h-64 overflow-auto">
          {projectFiles.length === 0 && <div className="px-2 py-3 text-xs text-gray-400">No project files available.</div>}
          {projectFiles.length > 0 && <div className="py-1">{treeNodes.map((node) => renderNode(node))}</div>}
          {fileTreeLoading && <div className="px-2 py-2 text-xs text-gray-400">Loading file...</div>}
        </div>
      )}
    </div>
  );
};
