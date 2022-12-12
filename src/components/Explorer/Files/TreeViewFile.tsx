import { useState, useMemo } from 'react';
import { VscFile } from 'react-icons/vsc';
import { useContextMenu } from "react-contexify";

import { useServices } from '../../../services';
import { useFilesState, usePanelsState } from '../../../state';

import type { FunctionComponent } from 'react';
import type { File } from '../../../state/files.state';

interface TreeViewFileActionsProps {
  file: File;
}

export const TreeViewFileActions: FunctionComponent<TreeViewFileActionsProps> = ({
  file,
}) => {
  const actions = useMemo(() => {
    return [
      // <IconButton
      //   icon={<VscClose className='w-3.5 h-3.5' />}
      //   tooltip={{
      //     content: 'Close file',
      //     delay: [500, 0],
      //   }} 
      //   // onClick={e => {
      //   //   e.stopPropagation();
      //   //   showModal(EditFileModal, { item: file });
      //   // }}
      // />,
      // <IconButton
      //   icon={<VscTrash className='w-3.5 h-3.5' />}
      //   tooltip={{
      //     content: 'Delete file',
      //     delay: [500, 0],
      //   }} 
      //   onClick={e => {
      //     e.stopPropagation();
      //     showModal(DeleteFileModal, { item: file });
      //   }}
      // />,
    ];
  }, [file]);

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

interface TreeViewFileProps {
  id: string;
  deep?: number
}

export const TreeViewFile: FunctionComponent<TreeViewFileProps> = ({
  id,
  deep = 0,
}) => {
  const { filesSvc, panelsSvc } = useServices();
  const file = useFilesState(state => state.files[id]);
  const activeTab = usePanelsState(() => panelsSvc.getActiveTab('primary'));
  const [hover, setHover] = useState<boolean>(false);
  const { show: showContextMenu, hideAll: hideAllContextMenus } = useContextMenu({ id: 'fs-file' });
  
  if (!file) {
    return null;
  }

  const { name, language } = file;
  const isModified = filesSvc.isFileModified(file.id);

  return (
    <div
      className='flex flex-col'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={event => {
        event.stopPropagation();
        hideAllContextMenus();
        panelsSvc.setActiveTab('primary', id);
      }}
      onDoubleClick={event => {
        event.stopPropagation();
        hideAllContextMenus();
        panelsSvc.openEditorTab('primary', file);
      }}
      onContextMenu={event => {
        event.preventDefault();
        event.stopPropagation();
        showContextMenu({ event, props: { file } });
      }}
    >
      <div 
        className={`flex flex-row items-center justify-between ${activeTab?.fileId === file.id ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'} cursor-pointer text-xs leading-4 text-gray-300 pr-2 py-1`}
        style={{ paddingLeft: `${0.5 * deep}rem` }}
      >
        <button className="flex-none flex items-center justify-center mr-1">
          <VscFile className='w-3.5 h-3.5' />
        </button>

        <span className={`flex-1 inline-block overflow-hidden whitespace-nowrap text-ellipsis p-0.5 ${isModified ? 'text-yellow-500' : 'text-gray-300'}`}>
          {name}.{language}
        </span>

        <div className={`flex-none transition-opacity ${hover ? 'opacity-1' : 'opacity-0'}`}>
          <TreeViewFileActions file={file} />
        </div>
      </div>
    </div>
  );
};
