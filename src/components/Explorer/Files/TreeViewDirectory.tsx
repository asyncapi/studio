import { useState, useMemo } from 'react';
import { VscFolder, VscFolderOpened, VscEdit, VscTrash, VscNewFile, VscNewFolder } from 'react-icons/vsc';
import { show } from '@ebay/nice-modal-react';

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
        tooltip='Create New File'
        onClick={e => {
          e.stopPropagation();
          show(CreateNewFileModal, { directory });
        }}
      />,
      <IconButton
        icon={<VscNewFolder className='w-3.5 h-3.5' />}
        tooltip='Create New Directory'
        onClick={e => {
          e.stopPropagation();
          show(CreateNewDirectoryModal, { directory });
        }}
      />,
      <IconButton
        icon={<VscEdit className='w-3.5 h-3.5' />}
        tooltip='Edit Directory'
        onClick={e => {
          e.stopPropagation();
          show(EditFileModal, { item: directory });
        }}
      />,
      <IconButton
        icon={<VscTrash className='w-3.5 h-3.5' />}
        tooltip='Delete Directory'
        onClick={e => {
          e.stopPropagation();
          show(DeleteFileModal, { item: directory });
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
            setExpanded(oldState => !oldState);
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <button className="flex-none flex items-center justify-center mr-1">
            {expanded ? (
              <VscFolderOpened className='w-3.5 h-3.5' />
            ) : (
              <VscFolder className='w-3.5 h-3.5' />
            )}
          </button>

          <h3 className="flex-1 inline-block overflow-hidden whitespace-nowrap text-ellipsis p-0.5">
            {name}
          </h3>

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
