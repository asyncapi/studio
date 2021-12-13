import React, { useEffect, useState } from 'react';
import { VscClose, VscJson, VscNewFile, VscNewFolder, VscSaveAll, VscCollapseAll, VscTrash } from 'react-icons/vsc';

import { ContextPanel } from '../ContextPanel';

import { FilesManager, File, PanelsManager } from '../../../services';

import state from '../../../state';

interface FileItemProps extends File {}

const FileItem: React.FunctionComponent<FileItemProps> = (file) => {
  const {
    id,
    name,
    extension
  } = file;
  const panelsState = state.usePanelsState();
  const activePanel = panelsState.activePanel.get();

  return (
    <li 
      className={`group hover:bg-gray-900 text-xs text-gray-300 leading-6 cursor-pointer px-2`}
      // onClick={(e) => {
      //   e.stopPropagation();
      //   PanelsManager.addFileTab(file, activePanel);
      //   // PanelsManager.updateActiveTab(id, panelID);
      // }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        PanelsManager.addFileTab(FilesManager.getFile(file.id)!, activePanel);
        // PanelsManager.updateActiveTab(id, panelID);
      }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <div className="inline-block -mt-0.5 mr-1">
            <VscJson className="inline-block w-4 h-4" />
          </div>
          <span>
            {name}.{extension}
          </span>
        </div>
        <div className={`block text-gray-800 group-hover:text-gray-300`}>
          <button 
            className='inline-block -mt-0.5'
            onClick={ev => {
              ev.stopPropagation();
              FilesManager.deleteFile(id);
            }}
          >
            <VscTrash className="inline-block w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
}

interface FileSystemProps {}

export const FileSystem: React.FunctionComponent<FileSystemProps> = () => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const listener = FilesManager.addFilesListener(newFiles => {
      newFiles && setFiles(newFiles);
    });
    return () => {
      FilesManager.removeFilesListener(listener);
    };
  }, []);

  const menu = (
    <div className="flex flex-row">
      <button 
        className='inline-block'
        onClick={ev => {
          ev.stopPropagation();
          FilesManager.addFile();
        }}
      >
        <VscNewFile className="inline-block w-4 h-4" />
      </button>
      {/* <button 
        className='inline-block ml-1.5'
        onClick={ev => {
          ev.stopPropagation();
          // PanelsManager.restoreDefaultPanels();
        }}
      >
        <VscNewFolder className="inline-block w-4 h-4" />
      </button> */}
      <button 
        className='inline-block ml-1.5'
        onClick={ev => {
          ev.stopPropagation();
          // PanelsManager.restoreDefaultPanels();
        }}
      >
        <VscSaveAll className="inline-block w-4 h-4" />
      </button>
      {/* <button 
        className='inline-block ml-1.5'
        onClick={ev => {
          ev.stopPropagation();
          // PanelsManager.restoreDefaultPanels();
        }}
      >
        <VscCollapseAll className="inline-block w-4 h-4" />
      </button> */}
    </div>
  );

  return (
    <ContextPanel title="Files" menu={menu} opened={true}>
      <ul>
        {files.map(file => (
          <FileItem key={file.id} {...file} />
        ))}
      </ul>
    </ContextPanel>
  );
};
