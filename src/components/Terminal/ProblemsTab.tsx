import React from 'react';

import { NavigationService } from '../../services';
import state from '../../state';

interface ProblemsTabProps {}

export const ProblemsTab: React.FunctionComponent<ProblemsTabProps> = () => {
  const parserState = state.useParserState();
  const errors = parserState.errors.get();

  return (
    <div>
      <span className="text-xs">Problems</span>
      <span className="inline-block rounded-full bg-gray-400 px-1.5 py-0.5 ml-1.5 -mt-2 text-xs">
        {errors.length || 0}
      </span>
    </div>
  );
};

export const ProblemsTabContent: React.FunctionComponent<ProblemsTabProps> = () => {
  const parserState = state.useParserState();
  const errors = parserState.errors.get();

  return (
    <div className="flex-1 text-white text-xs h-full relative overflow-x-hidden overflow-y-auto">
      {errors.length ? (
        <div className="px-4">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="w-8">Line</th>
                <th className="p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((err: any, id) => {
                const { title, detail, location } = err;
                let renderedLine = err.location?.startLine;
                renderedLine = renderedLine && err.location?.startColumn ? `${renderedLine}:${err.location?.startColumn}` : renderedLine;
                return (
                  <tr key={title || id} className="border-t border-gray-700">
                    <td
                      className="p-2 cursor-pointer text-center"
                      onClick={() =>
                        NavigationService.scrollToEditorLine(
                          location?.startLine || 0,
                          location?.startColumn,
                        )
                      }
                    >
                      {renderedLine || '-'}
                    </td>
                    <td className="p-2 text-left">{title}{detail ? ` - ${detail}` : ''}</td>
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
