import { useState, useMemo } from 'react';
import { VscFolder, VscFolderOpened, VscRootFolder } from 'react-icons/vsc';
import { useContextMenu } from "react-contexify";

import { TreeViewFile } from './TreeViewFile';
import { IconButton } from '../../common';

import { useServices } from '../../../services';
import { useFilesState } from '../../../state';

import type { FunctionComponent, ReactNode } from 'react';
import type { File, Directory } from '../../../state/files.state';

function renderChild(child: Directory | File, deep: number = 0) {
  let content: ReactNode = null;
  if (child.type === 'directory') {
    content = <TreeViewDirectory id={child.id} deep={deep} />
  } else {
    content = <TreeViewFile id={child.id} deep={deep} />
  }

  return (
    <li key={child.id}>
      {content}
    </li>
  );
}

interface TreeViewDirectoryInfosProps {
  directory: Directory;
  deep: number;
}

export const TreeViewDirectoryInfos: FunctionComponent<TreeViewDirectoryInfosProps> = ({
  directory,
  deep,
}) => {
  const infos = useMemo(() => {
    return [
      deep === 1 && directory.from === 'file-system' && (
        <IconButton
          icon={<VscRootFolder className='w-3.5 h-3.5' />}
          tooltip={{
            content: 'File system directory',
            delay: [500, 0],
          }}
        />
      ),
    ].filter(Boolean);
  }, [directory]);

  if (infos.length === 0) {
    return null;
  }

  return (
    <ul className='flex flex-row items-center justify-between'>
      {infos.map((action, idx) => (
        <li key={idx}>
          {action}
        </li>
      ))}
    </ul>
  );
}

interface TreeViewDirectoryProps {
  id: string;
  expanded?: boolean;
  deep?: number
}

export const TreeViewDirectory: FunctionComponent<TreeViewDirectoryProps> = ({
  id,
  expanded: initialExpanded = false,
  deep = 0,
}) => {
  const { filesSvc } = useServices();
  const directory = useFilesState(state => state.directories[id]);
  const [expanded, setExpanded] = useState<boolean>(initialExpanded);
  const { show: showContextMenu, hideAll: hideAllContextMenus } = useContextMenu({ id: 'fs-directory' });

  if (!directory) {
    return null;
  }

  const rootDirectory = filesSvc.getRootDirectory();
  const { children, name } = directory;
  return (
    <div className='flex flex-col'>
      {id !== rootDirectory.id && (
        <div 
          className='flex flex-row items-center justify-between bg-gray-800 hover:bg-gray-700 cursor-pointer text-xs leading-2 text-gray-300 pr-2 py-1'
          style={{ paddingLeft: `${0.5 * deep}rem` }}
          onClick={event => {
            event.stopPropagation();
            hideAllContextMenus();
            setExpanded(oldState => !oldState);
          }}
          onContextMenu={event => {
            event.preventDefault();
            event.stopPropagation();
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

          <div className='flex-none'>
            <TreeViewDirectoryInfos directory={directory} deep={deep} />
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
