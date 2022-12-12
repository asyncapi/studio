import { useMemo } from 'react';

import { useDocumentsState } from '../../../state';

import type { FunctionComponent } from 'react';

interface DiagnosticTabProps {}

export const DiagnosticTab: FunctionComponent<DiagnosticTabProps> = () => {
  const documents = useDocumentsState(state => state.documents);

  const { errors, warnings, informations, hints } = useMemo(() => {
    const length = {
      errors: 0,
      warnings: 0,
      informations: 0,
      hints: 0,
    };

    Object.values(documents).forEach(({ diagnostics }) => {
      length.errors += diagnostics.errors.length;
      length.warnings += diagnostics.warnings.length;
      length.informations += diagnostics.informations.length;
      length.hints += diagnostics.hints.length;
    });

    return length;
  }, [documents]);

  return (
    <div className='flex flex-row items-center'>
      <span className="text-xs">Diagnostics</span>
      <ul className='flex flex-row items-center'>
        {errors > 0 && (
          <li>
            <span className='inline-block rounded-full px-1.5 ml-1.5 text-xs bg-red-500'>
              {errors}
            </span>
          </li>
        )}
        {warnings > 0 && (
          <li>
            <span className='inline-block rounded-full px-1.5 ml-1 text-xs bg-yellow-500'>
              {warnings}
            </span>
          </li>
        )}
        {informations > 0 && (
          <li>
            <span className='inline-block rounded-full px-1.5 ml-1 text-xs bg-blue-500'>
              {informations}
            </span>
          </li>
        )}
        {hints > 0 && (
          <li>
            <span className='inline-block rounded-full px-1.5 ml-1 text-xs bg-green-500'>
              {hints}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};
