import { useState, useMemo } from 'react';
import { VscFolder, VscFolderOpened, VscEdit, VscTrash, VscNewFile, VscNewFolder } from 'react-icons/vsc';
import { show as showModal } from '@ebay/nice-modal-react';
import { useContextMenu } from "react-contexify";

import { TreeViewFile } from './TreeViewFile';
import { CreateNewDirectoryModal, CreateNewFileModal, EditFileModal, DeleteFileModal } from '../../Modals/Files';
import { IconButton } from '../../common';

import { useFilesState } from '../../../state';

import type { FunctionComponent, ReactNode } from 'react';
import type { File, Directory } from '../../../state/files.state';

function renderChild(child: Directory | File, deep: number = 0) {
  let content: ReactNode = null;
  if (child.type === 'directory') {
    content = <TreeViewDirectory uri={child.uri} deep={deep} />
  } else {
    content = <TreeViewFile uri={child.uri} deep={deep} />
  }

  return (
    <li key={child.uri}>
      {content}
    </li>
  );
}

interface TreeViewDirectoryActionsProps {
  directory: Directory;
}

export const TreeViewDirectoryActions: FunctionComponent<TreeViewDirectoryActionsProps> = ({
  directory,
}) => {
  const actions = useMemo(() => {
    return [
      <IconButton
        icon={<VscNewFile className='w-3.5 h-3.5' />}
        tooltip={{
          content: 'Create new file',
          delay: [500, 0],
        }} 
        onClick={e => {
          e.stopPropagation();
          showModal(CreateNewFileModal, { directory });
        }}
      />,
      <IconButton
        icon={<VscNewFolder className='w-3.5 h-3.5' />}
        tooltip={{
          content: 'Create new directory',
          delay: [500, 0],
        }} 
        onClick={e => {
          e.stopPropagation();
          showModal(CreateNewDirectoryModal, { directory });
        }}
      />,
      <IconButton
        icon={<VscEdit className='w-3.5 h-3.5' />}
        tooltip={{
          content: 'Edit directory',
          delay: [500, 0],
        }} 
        onClick={e => {
          e.stopPropagation();
          showModal(EditFileModal, { item: directory });
        }}
      />,
      <IconButton
        icon={<VscTrash className='w-3.5 h-3.5' />}
        tooltip={{
          content: 'Delete directory',
          delay: [500, 0],
        }} 
        onClick={e => {
          e.stopPropagation();
          showModal(DeleteFileModal, { item: directory });
        }}
      />,
    ];
  }, [directory]);

  return (
    <ul className='flex flex-row items-center justify-between'>
      {actions.map((action, idx) => (
        <li key={idx}>
          {action}
        </li>
      ))}
    </ul>
  );
}

interface TreeViewDirectoryProps {
  uri: string;
  expanded?: boolean;
  deep?: number
}

export const TreeViewDirectory: FunctionComponent<TreeViewDirectoryProps> = ({
  uri,
  expanded: initialExpanded = false,
  deep = 0,
}) => {
  const directory = useFilesState(state => state.directories[uri]);
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);
  const [hover, setHover] = useState<boolean>(false);
  const { show: showContextMenu, hideAll: hideAllContextMenus } = useContextMenu({ id: 'fs-directory' });

  if (!directory) {
    return null;
  }

  const { children, name } = directory;
  return (
    <div className='flex flex-col'>
      {uri !== 'root' && (
        <div 
          className='flex flex-row items-center justify-between bg-gray-800 hover:bg-gray-700 cursor-pointer text-xs leading-2 text-gray-300 pr-2 py-1'
          style={{ paddingLeft: `${0.5 + 0.5 * deep}rem` }}
          onClick={(e) => {
            e.stopPropagation();
            hideAllContextMenus();
            setExpanded(oldState => !oldState);
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onContextMenu={(event) => {
            event.preventDefault();
            showContextMenu({ event, props: { directory } });
          }}
        >
          <button className="flex-none flex items-center justify-center mr-1">
            {expanded ? (
              <VscFolderOpened className='w-3.5 h-3.5' />
            ) : (
              <VscFolder className='w-3.5 h-3.5' />
            )}
          </button>

          <span className="flex-1 inline-block overflow-hidden whitespace-nowrap text-ellipsis p-0.5">
            {name}
          </span>

          <div className={`flex-none transition-opacity ${hover ? 'opacity-1' : 'opacity-0'}`}>
            <TreeViewDirectoryActions directory={directory} />
          </div>
        </div>
      )}

      {children.length > 0 ? (
        <div className={`${expanded ? 'block' : 'hidden'}`}>
          <ul>
            {children.map(child => renderChild(child, deep + 1))}
          </ul>
        </div>
      ) : (
        null
      )}
    </div>
  );
};
