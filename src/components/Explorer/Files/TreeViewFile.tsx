import { useState, useMemo } from 'react';
import { VscFile, VscEdit, VscTrash } from 'react-icons/vsc';
import { show } from '@ebay/nice-modal-react';

import { EditFileModal, DeleteFileModal } from '../../Modals/Files';
import { IconButton } from '../../common';

import { useServices } from '../../../services';
import { useFilesState } from '../../../state';

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
      <IconButton
        icon={<VscEdit className='w-3.5 h-3.5' />}
        tooltip={{
          content: 'Edit file',
          delay: [500, 0],
        }} 
        onClick={e => {
          e.stopPropagation();
          show(EditFileModal, { item: file });
        }}
      />,
      <IconButton
        icon={<VscTrash className='w-3.5 h-3.5' />}
        tooltip={{
          content: 'Delete file',
          delay: [500, 0],
        }} 
        onClick={e => {
          e.stopPropagation();
          show(DeleteFileModal, { item: file });
        }}
      />,
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
  uri: string;
  deep?: number
}

export const TreeViewFile: FunctionComponent<TreeViewFileProps> = ({
  uri,
  deep = 0,
}) => {
  const { panelsSvc } = useServices();
  const file = useFilesState(state => state.files[uri]);
  const [hover, setHover] = useState<boolean>(false);
  if (!file) {
    return null;
  }

  const { name, language } = file;
  return (
    <div
      className='flex flex-col'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={e => {
        e.stopPropagation();
        panelsSvc.setActiveTab('primary', uri);
      }}
      onDoubleClick={e => {
        e.stopPropagation();
        panelsSvc.openTab('primary', uri, { id: uri, panel: 'primary', type: 'editor', uri });
      }}
    >
      <div 
        className='flex flex-row items-center justify-between bg-gray-800 hover:bg-gray-700 cursor-pointer text-xs leading-4 text-gray-300 pr-2 py-1'
        style={{ paddingLeft: `${0.5 + 0.5 * deep}rem` }}
      >
        <button className="flex-none flex items-center justify-center mr-1">
          <VscFile className='w-3.5 h-3.5' />
        </button>

        <span className="flex-1 inline-block overflow-hidden whitespace-nowrap text-ellipsis p-0.5">
          {name}.{language}
        </span>

        <div className={`flex-none transition-opacity ${hover ? 'opacity-1' : 'opacity-0'}`}>
          <TreeViewFileActions file={file} />
        </div>
      </div>
    </div>
  );
};
