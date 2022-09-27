import React, { useCallback, useRef, useState } from 'react';
import { VscError, VscWarning, VscInfo, VscLightbulb, VscSearch, VscClose } from 'react-icons/vsc';

import { NavigationService } from '../../services';
import { debounce } from '../../helpers';
import state from '../../state';

import type { Diagnostic } from '@asyncapi/parser/esm';

interface ProblemsTabProps {}

export const ProblemsTab: React.FunctionComponent<ProblemsTabProps> = () => {
  const parserState = state.useParserState();
  const diagnostics = parserState.diagnostics.get();

  const errorDiagnostics = diagnostics.filter(diagnostic => diagnostic.severity === 0);
  const warningDiagnostics = diagnostics.filter(diagnostic => diagnostic.severity === 1);
  const infoDiagnostics = diagnostics.filter(diagnostic => diagnostic.severity === 2);
  const hintDiagnostics = diagnostics.filter(diagnostic => diagnostic.severity === 3);

  return (
    <div className='flex flex-row items-center'>
      <span className="text-xs">Diagnostics</span>
      <ul className='flex flex-row items-center'>
        {errorDiagnostics.length > 0 && (
          <li>
            <span className='inline-block rounded-full px-1.5 ml-1.5 text-xs bg-red-500'>
              {errorDiagnostics.length}
            </span>
          </li>
        )}
        {warningDiagnostics.length > 0 && (
          <li>
            <span className='inline-block rounded-full px-1.5 ml-1 text-xs bg-yellow-500'>
              {warningDiagnostics.length}
            </span>
          </li>
        )}
        {infoDiagnostics.length > 0 && (
          <li>
            <span className='inline-block rounded-full px-1.5 ml-1 text-xs bg-blue-500'>
              {infoDiagnostics.length}
            </span>
          </li>
        )}
        {hintDiagnostics.length > 0 && (
          <li>
            <span className='inline-block rounded-full px-1.5 ml-1 text-xs bg-blue-500'>
              {hintDiagnostics.length}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

interface SeverityIconProps {
  severity: Diagnostic['severity']
}

const SeverityIcon: React.FunctionComponent<SeverityIconProps> = ({ severity }) => {
  switch (severity) {
  case 1: return (
    <div className='flex flex-row items-center justify-center'>
      <VscWarning className='text-yellow-500 w-4 h-4' />
    </div>
  );
  case 2: return (
    <div className='flex flex-row items-center justify-center'>
      <VscInfo className='text-blue-500 w-4 h-4' />
    </div>
  );
  case 3: return (
    <div className='flex flex-row items-center justify-center'>
      <VscLightbulb className='text-green-500 w-4 h-4' />
    </div>
  );
  default: return (
    <div className='flex flex-row items-center justify-center'>
      <VscError className='text-red-500 w-4 h-4' />
    </div>
  );
  }
};

type ActiveSeverity = 0 | 1 | 2 | 3 | 'all';

interface SeverityButtonsProps {
  diagnostics: Diagnostic[];
  active: ActiveSeverity;
  setActive: React.Dispatch<React.SetStateAction<ActiveSeverity>>;
}

const SeverityButtons: React.FunctionComponent<SeverityButtonsProps> = ({ diagnostics, active, setActive: defaultSetActive }) => {
  const errorDiagnostics = diagnostics.filter(diagnostic => diagnostic.severity === 0);
  const warningDiagnostics = diagnostics.filter(diagnostic => diagnostic.severity === 1);
  const infoDiagnostics = diagnostics.filter(diagnostic => diagnostic.severity === 2);
  const hintDiagnostics = diagnostics.filter(diagnostic => diagnostic.severity === 3);

  const activeBg = 'bg-gray-900';
  const notActiveBg = 'bg-gray-700';

  const setActive = useCallback((type: ActiveSeverity) => {
    defaultSetActive(type === active ? 'all' : type);
  }, [active]);

  return (
    <ul className='flex flex-row items-center'>
      <button
        type="button"
        className={`disabled:cursor-not-allowed w-full inline-flex justify-center rounded-l-md border border-transparent shadow-xs px-2 py-1 ${active === 0 ? activeBg : notActiveBg} text-xs font-medium text-white hover:bg-gray-900 disabled:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-700`}
        onClick={() => setActive(0)}
        disabled={errorDiagnostics.length === 0}
      >
        <div className='flex flex-row items-center justify-center'>
          <SeverityIcon severity={0} />
          <span className='ml-1'>{errorDiagnostics.length}</span>
        </div>
      </button>
      <button
        type="button"
        className={`disabled:cursor-not-allowed w-full inline-flex justify-center border border-transparent shadow-xs px-2 py-1 ml-px ${active === 1 ? activeBg : notActiveBg} text-xs font-medium text-white hover:bg-gray-900 disabled:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-700`}
        onClick={() => setActive(1)}
        disabled={warningDiagnostics.length === 0}
      >
        <div className='flex flex-row items-center justify-center'>
          <SeverityIcon severity={1} />
          <span className='ml-1'>{warningDiagnostics.length}</span>
        </div>
      </button>
      <button
        type="button"
        className={`disabled:cursor-not-allowed w-full inline-flex justify-center border border-transparent shadow-xs px-2 py-1 ml-px ${active === 2 ? activeBg : notActiveBg} text-xs font-medium text-white hover:bg-gray-900 disabled:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-700`}
        onClick={() => setActive(2)}
        disabled={infoDiagnostics.length === 0}
      >
        <div className='flex flex-row items-center justify-center'>
          <SeverityIcon severity={2} />
          <span className='ml-1'>{infoDiagnostics.length}</span>
        </div>
      </button>
      <button
        type="button"
        className={`disabled:cursor-not-allowed w-full inline-flex justify-center rounded-r-md border border-transparent shadow-xs px-2 py-1 ml-px ${active === 3 ? activeBg : notActiveBg} text-xs font-medium text-white hover:bg-gray-900 disabled:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-700`}
        onClick={() => setActive(3)}
        disabled={hintDiagnostics.length === 0}
      >
        <div className='flex flex-row items-center justify-center'>
          <SeverityIcon severity={3} />
          <span className='ml-1'>{hintDiagnostics.length}</span>
        </div>
      </button>
    </ul>
  );
};

export const ProblemsTabContent: React.FunctionComponent<ProblemsTabProps> = () => {
  const parserState = state.useParserState();
  const diagnostics = parserState.diagnostics.get();

  const [active, setActive] = useState<ActiveSeverity>('all');
  const [search, setSearch] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 text-white text-xs h-full relative overflow-x-hidden overflow-y-auto">
      {diagnostics.length ? (
        <div className="px-4 pt-2">
          <div className='pb-2 flex flex-row items-center'>
            <SeverityButtons diagnostics={diagnostics} active={active} setActive={setActive} />
            <div className='mx-3 flex-1 flex flex-row items-center justify-center rounded-md border border-transparent shadow-xs px-2 py-1 bg-gray-700 text-xs font-medium'>
              <VscSearch />
              <input ref={inputRef} className='w-full ml-2 bg-gray-700 border-transparent focus:border-transparent focus:ring-0 focus:outline-none' onChange={debounce((e) => setSearch(e.target.value), 250)} />
              <button type='button' className={`hover:bg-gray-900 rounded-sm border border-transparent ${search ? 'opacity-100' : 'opacity-0'}`} onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = '';
                }
                setSearch('');
              }}>
                <VscClose />
              </button>
            </div>
            <a href='https://stoplight.io/open-source/spectral' title='Spectral website' target='_blank' rel="noreferrer" className='text-white hover:text-blue-500'>
              <span>
                Powered by
              </span>
              {' '}
              <strong>
                Spectral
              </strong>
            </a>
          </div>

          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="px-2 py-1 w-8">Type</th>
                <th className="px-2 py-1 w-8">Line</th>
                <th className="px-2 py-1 text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {diagnostics.map((diagnostic, id) => {
                const { severity, message, range } = diagnostic;

                if (active !== 'all' && severity !== active) {
                  return null;
                }
                if (search && !message.includes(search)) {
                  return null;
                }

                return (
                  <tr key={id} className="border-t border-gray-700">
                    <td className="px-2 py-1 text-right"><SeverityIcon severity={severity} /></td>
                    <td
                      className="px-2 py-1 cursor-pointer"
                      onClick={() =>
                        NavigationService.scrollToEditorLine(
                          range.start.line + 1,
                          range.start.character + 1,
                        )
                      }
                    >
                      {range.start.line + 1}:{range.start.character + 1}
                    </td>
                    <td className="px-2 py-1 text-left">{message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-2 px-4 w-full text-sm">
          No problems have been detected in the AsyncAPI document so far.
        </div>
      )}
    </div>
  );
};
