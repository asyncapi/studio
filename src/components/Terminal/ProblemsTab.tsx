import React, { useCallback, useMemo, useRef, useState } from 'react';
import { VscError, VscWarning, VscInfo, VscLightbulb, VscSearch, VscClose, VscSettingsGear } from 'react-icons/vsc';
import { DiagnosticSeverity } from '@asyncapi/parser/cjs';

import { Tooltip } from '../common';
import { useServices } from '../../services';
import { debounce } from '../../helpers';
import state from '../../state';

import type { FunctionComponent } from 'react';
import type { Diagnostic } from '@asyncapi/parser/cjs';

interface ProblemsTabProps {}

export const ProblemsTab: FunctionComponent<ProblemsTabProps> = () => {
  const { specificationSvc } = useServices();
  const governanceShowState = state.useSettingsState().governance.show.get();
  const diagnostics = state.useParserState().diagnostics.get();

  const filteredDiagnostics = useMemo(() => {
    return specificationSvc.filterDiagnostics();
  }, [diagnostics, governanceShowState.warnings, governanceShowState.informations, governanceShowState.hints]);

  const errorDiagnostics = filteredDiagnostics.filter(diagnostic => diagnostic.severity === 0);
  const warningDiagnostics = filteredDiagnostics.filter(diagnostic => diagnostic.severity === 1);
  const infoDiagnostics = filteredDiagnostics.filter(diagnostic => diagnostic.severity === 2);
  const hintDiagnostics = filteredDiagnostics.filter(diagnostic => diagnostic.severity === 3);

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

function filterDiagnostics(diagnostics: Diagnostic[], severity: DiagnosticSeverity) {
  return diagnostics.filter(diagnostic => diagnostic.severity === severity);
}

function createProperMessage(
  disabled: boolean,
  active: DiagnosticSeverity[],
  severity: DiagnosticSeverity,
  showMessage: string,
  hideMessage: string,
  firstMessage: string,
) {
  if (disabled) {
    return 'Disabled. Enable it in the settings.';
  }
  if (active.some(s => s === severity)) {
    if (active.length === 1) {
      return 'Show all diagnostics';
    }
    return hideMessage;
  }
  if (active.length === 0) {
    return firstMessage;
  }
  return showMessage;
}

interface SeverityButtonsProps {
  diagnostics: Diagnostic[];
  active: DiagnosticSeverity[];
  setActive: (severity: DiagnosticSeverity) => void;
}

const SeverityButtons: FunctionComponent<SeverityButtonsProps> = ({ diagnostics, active, setActive }) => {
  const governanceShowState = state.useSettingsState().governance.show.get();

  const errorDiagnostics = filterDiagnostics(diagnostics, DiagnosticSeverity.Error);
  const warningDiagnostics = filterDiagnostics(diagnostics, DiagnosticSeverity.Warning);
  const infoDiagnostics = filterDiagnostics(diagnostics, DiagnosticSeverity.Information);
  const hintDiagnostics = filterDiagnostics(diagnostics, DiagnosticSeverity.Hint);

  const errorsTooltip = createProperMessage(false, active, DiagnosticSeverity.Error, 'Show errors', 'Hide errors', 'Show only errors');
  const warningsTooltip = createProperMessage(!governanceShowState.warnings, active, DiagnosticSeverity.Warning, 'Show warnings', 'Hide warnings', 'Show only warnings');
  const informationTooltip = createProperMessage(!governanceShowState.informations, active, DiagnosticSeverity.Information, 'Show information messages', 'Hide information messages', 'Show only information messages');
  const hintsTooltip = createProperMessage(!governanceShowState.hints, active, DiagnosticSeverity.Hint, 'Show hints', 'Hide hints', 'Show only hints');

  const activeBg = 'bg-gray-900';
  const notActiveBg = 'bg-gray-700';

  return (
    <ul className='flex flex-row items-center'>
      <Tooltip content={errorsTooltip}>
        <li>
          <button
            type="button"
            className={`disabled:cursor-not-allowed w-full inline-flex justify-center rounded-l-md border border-transparent shadow-xs px-2 py-1 ${active.some(s => s === DiagnosticSeverity.Error) ? activeBg : notActiveBg} text-xs font-medium text-white hover:bg-gray-900 disabled:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-700`}
            onClick={() => setActive(DiagnosticSeverity.Error)}
          >
            <div className='flex flex-row items-center justify-center'>
              <SeverityIcon severity={0} />
              <span className='ml-1'>{errorDiagnostics.length}</span>
            </div>
          </button>
        </li>
      </Tooltip>
      <Tooltip content={warningsTooltip}>
        <li>
          <button
            type="button"
            className={`disabled:cursor-not-allowed w-full inline-flex justify-center border border-transparent shadow-xs px-2 py-1 ml-px ${governanceShowState.warnings && active.some(s => s === DiagnosticSeverity.Warning) ? activeBg : notActiveBg} text-xs font-medium text-white hover:bg-gray-900 disabled:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-700`}
            onClick={() => setActive(DiagnosticSeverity.Warning)}
            disabled={!governanceShowState.warnings}
          >
            <div className='flex flex-row items-center justify-center'>
              <SeverityIcon severity={1} />
              <span className='ml-1'>{warningDiagnostics.length}</span>
            </div>
          </button>
        </li>
      </Tooltip>
      <Tooltip content={informationTooltip}>
        <li>
          <button
            type="button"
            className={`disabled:cursor-not-allowed w-full inline-flex justify-center border border-transparent shadow-xs px-2 py-1 ml-px ${governanceShowState.informations && active.some(s => s === DiagnosticSeverity.Information) ? activeBg : notActiveBg} text-xs font-medium text-white hover:bg-gray-900 disabled:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-700`}
            onClick={() => setActive(DiagnosticSeverity.Information)}
            disabled={!governanceShowState.informations}
          >
            <div className='flex flex-row items-center justify-center'>
              <SeverityIcon severity={2} />
              <span className='ml-1'>{infoDiagnostics.length}</span>
            </div>
          </button>
        </li>
      </Tooltip>
      <Tooltip content={hintsTooltip}>
        <li>
          <button
            type="button"
            className={`disabled:cursor-not-allowed w-full inline-flex justify-center rounded-r-md border border-transparent shadow-xs px-2 py-1 ml-px ${governanceShowState.hints && active.some(s => s === DiagnosticSeverity.Hint) ? activeBg : notActiveBg} text-xs font-medium text-white hover:bg-gray-900 disabled:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-700`}
            onClick={() => setActive(DiagnosticSeverity.Hint)}
            disabled={!governanceShowState.hints}
          >
            <div className='flex flex-row items-center justify-center'>
              <SeverityIcon severity={3} />
              <span className='ml-1'>{hintDiagnostics.length}</span>
            </div>
          </button>
        </li>
      </Tooltip>
    </ul>
  );
};

export const ProblemsTabContent: FunctionComponent<ProblemsTabProps> = () => {
  const { specificationSvc, navigationSvc } = useServices();
  const settingsState = state.useSettingsState();
  const governanceShowState = settingsState.governance.show.get();
  const parserState = state.useParserState();
  const diagnostics = parserState.diagnostics.get();

  const [active, setActive] = useState<Array<DiagnosticSeverity>>([]);
  const [search, setSearch] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const setActiveFn = useCallback((severity: DiagnosticSeverity) => {
    setActive(acc => {
      if (acc.some(s => s === severity)) {
        return acc.filter(s => s !== severity);
      }
      return [...acc, severity];
    });
  }, [setActive]);

  const restrictedDiagnostics = useMemo(() => {
    return specificationSvc.filterDiagnostics();
  }, [diagnostics, governanceShowState.warnings, governanceShowState.informations, governanceShowState.hints]);

  const filteredDiagnostics = useMemo(() => {
    return restrictedDiagnostics.filter(diagnostic => {
      const { severity, message } = diagnostic;

      if (active.length && !active.some(s => s === severity)) {
        return false;
      }

      const lowerCasingSearch = search.toLowerCase();
      return !(lowerCasingSearch && !message.toLowerCase().includes(lowerCasingSearch));
    });
  }, [restrictedDiagnostics, search]);

  return (
    <div className="flex-1 text-white text-xs h-full relative overflow-x-hidden overflow-y-auto">
      <div className="px-4 pt-2">
        <div className='pb-2 flex flex-row items-center'>
          <SeverityButtons diagnostics={restrictedDiagnostics} active={active} setActive={setActiveFn} />
          <div className='ml-2 flex-1 flex flex-row items-center justify-center rounded-md border border-transparent shadow-xs px-2 py-1 bg-gray-700 text-xs font-medium'>
            <VscSearch />
            <input ref={inputRef} placeholder='Filter diagnostics...' className='w-full bg-gray-700 border-transparent ml-2 focus:border-transparent focus:ring-0 focus:outline-none' onChange={debounce((e) => setSearch(e.target.value), 250)} />
            <button type='button' className={`hover:bg-gray-900 rounded-sm border border-transparent ${search ? 'opacity-100' : 'opacity-0'}`} onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = '';
              }
              setSearch('');
            }}>
              <VscClose />
            </button>
          </div>
          <Tooltip content="Settings" hideOnClick={true}>
            <button
              type="button"
              className={'justify-center border border-transparent shadow-xs px-2 py-1 ml-2 text-xs rounded-md font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-700'}
              onClick={() => {
                settingsState.merge({
                  showModal: true,
                  activeTab: 'Governance',
                });
              }}
            >
              <VscSettingsGear className='w-4 h-4' />
            </button>
          </Tooltip>
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
            {filteredDiagnostics.map((diagnostic, id) => {
              const { severity, message, range } = diagnostic;

              return (
                <tr key={id} className="border-t border-gray-700">
                  <td className="px-2 py-1 text-right"><SeverityIcon severity={severity} /></td>
                  <td
                    className="px-2 py-1 cursor-pointer"
                    onClick={() =>
                      navigationSvc.scrollToEditorLine(
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
        {filteredDiagnostics.length === 0 && !search && (
          <div className='flex flex-row items-center justify-center mt-4 text-lg'>
            No issues.
          </div>
        )}
        {filteredDiagnostics.length === 0 && search && (
          <div className='flex flex-row items-center justify-center mt-4 text-lg'>
            No results for &quot;{search}&quot;.
          </div>
        )}
      </div>
    </div>
  );
};