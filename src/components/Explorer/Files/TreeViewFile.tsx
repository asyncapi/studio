import { useState, useMemo } from 'react';
import { VscFile, VscError, VscWarning, VscInfo, VscLightbulb, VscEdit } from 'react-icons/vsc';
import { useContextMenu } from "react-contexify";

import { IconButton } from '../../common';

import { useServices } from '../../../services';
import { useDocumentsState, useFilesState, usePanelsState } from '../../../state';

import type { FunctionComponent } from 'react';
import type { DocumentDiagnostics } from '../../../state/documents.state';
import type { File } from '../../../state/files.state';

interface TreeViewFileInfoProps {
  diagnostics: DocumentDiagnostics;
  file: File;
}

export const TreeViewFileInfo: FunctionComponent<TreeViewFileInfoProps> = ({
  diagnostics,
  file,
}) => {
  const { filesSvc } = useServices();
  const { errors, warnings, informations, hints } = diagnostics;

  const infos = useMemo(() => {
    return [
      errors?.length > 0 && (
        <IconButton
          icon={<VscError className='w-3.5 h-3.5 text-red-500' />}
          tooltip={{
            content: `${errors.length} errors`,
            delay: [500, 0],
          }}
        />
      ),
      warnings?.length > 0 && (
        <IconButton
          icon={<VscWarning className='w-3.5 h-3.5 text-yellow-500' />}
          tooltip={{
            content: `${warnings.length} warnings`,
            delay: [500, 0],
          }}
        />
      ),
      informations?.length > 0 && (
        <IconButton
          icon={<VscInfo className='w-3.5 h-3.5 text-blue-500' />}
          tooltip={{
            content: `${informations.length} informations`,
            delay: [500, 0],
          }}
          className='cursor-default'
        />
      ),
      hints?.length > 0 && (
        <IconButton
          icon={<VscLightbulb className='w-3.5 h-3.5 text-green-500' />}
          tooltip={{
            content: `${hints.length} hints`,
            delay: [500, 0],
          }}
        />
      ),
      filesSvc.isFileModified(file) && (
        <IconButton
          icon={<VscEdit className='w-3.5 h-3.5 text-yellow-500' />}
          tooltip={{
            content: `Modified`,
            delay: [500, 0],
          }}
        />
      ),
    ].filter(Boolean);
  }, [diagnostics]);

  if (infos.length === 0) {
    return null;
  }

  return (
    <ul className='flex flex-row items-center justify-between'>
      {infos.map((info, idx) => (
        <li key={idx}>
          {info}
        </li>
      ))}
    </ul>
  );
}

interface TreeViewFileProps {
  id: string;
  deep?: number;
}

export const TreeViewFile: FunctionComponent<TreeViewFileProps> = ({
  id,
  deep = 0,
}) => {
  const { filesSvc, panelsSvc } = useServices();
  const file = useFilesState(state => state.files[id]);
  const document = useDocumentsState(state => state.documents[id]);
  const activeTab = usePanelsState(() => panelsSvc.getActiveTab('primary'));
  const { show: showContextMenu, hideAll: hideAllContextMenus } = useContextMenu({ id: 'fs-file' });
  
  if (!file) {
    return null;
  }

  const { name, language } = file;
  const isModified = filesSvc.isFileModified(file.id);
  const isValid = document?.valid ?? true;
  const diagnostics = document?.diagnostics || {};
  const isActiveTab = activeTab?.fileId === file.id;
  const colorText = isValid ? (isModified ? 'text-yellow-500' : 'text-gray-300') : 'text-red-400';

  return (
    <div
      className='flex flex-col'
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
        className={`flex flex-row items-center justify-between ${isActiveTab ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'} cursor-pointer text-xs leading-4 text-gray-300 pr-2 py-1`}
        style={{ paddingLeft: `${0.5 * deep}rem` }}
      >
        <button className="flex-none flex items-center justify-center mr-1">
          <VscFile className='w-3.5 h-3.5' />
        </button>

        <span className={`flex-1 inline-block overflow-hidden whitespace-nowrap text-ellipsis p-0.5 ${colorText}`}>
          {name}.{language}
        </span>

        <div className='flex-none'>
          <TreeViewFileInfo diagnostics={diagnostics} file={file} />
        </div>
      </div>
    </div>
  );
};
