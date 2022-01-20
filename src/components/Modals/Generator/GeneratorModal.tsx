import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { JSONSchema7 } from 'json-schema';

import { ConfirmModal, ConfirmModalHandle } from '../index';
import { TemplateParameters, TemplateParametersHandle } from './TemplateParameters';

import { ServerAPIProblem, ServerAPIService } from '../../../services';

import state from '../../../state';

import templates from './template-parameters.json';

export const GeneratorModal: React.FunctionComponent = () => {
  const [template, setTemplate] = useState('');
  const [templateParams, setTemplateParams] = useState<JSONSchema7>({});
  const [problem, setProblem] = useState<ServerAPIProblem & { validationErrors: any[] } | null>(null);

  const modalRef = useRef<ConfirmModalHandle>(null);
  const templateParamsRef = useRef<TemplateParametersHandle>(null);

  useEffect(() => {
    setProblem(null);
  }, [template, setProblem]);

  const generateTemplate = async () => {
    setProblem(null);
    const response = await ServerAPIService.generate({
      asyncapi: state.editor.editorValue.get(),
      template,
      parameters: templateParamsRef.current?.getValues(),
    });

    if (response.ok) {
      modalRef.current?.close();
      setTemplate('');
      setTemplateParams({});
    } else {
      const problem = await ServerAPIService.retrieveProblem(response);
      setProblem(problem as ServerAPIProblem & { validationErrors: string[] });
      throw new Error(problem?.title);
    }
  };

  const onSubmit = () => {
    toast.promise(generateTemplate(), {
      loading: 'Generating...',
      success: (
        <div>
          <span className="block text-bold">
            Succesfully generated!
          </span>
        </div>
      ),
      error: (
        <div>
          <span className="block text-bold text-red-400">
            Failed to generate.
          </span>
        </div>
      ),
    });
  };

  return (
    <ConfirmModal
      ref={modalRef}
      title="Generate template based on AsyncAPI document"
      confirmText="Generate"
      confirmDisabled={!template}
      opener={
        <button
          type="button"
          className="px-4 py-1 w-full text-left text-sm rounded-md focus:outline-none transition ease-in-out duration-150"
          title="Generate template"
        >
          Generate template
        </button>
      }
      onSubmit={onSubmit}
      closeAfterSumbit={false}
    >
      <div>
        <div className="flex flex-row content-center justify-between text-sm">
          <label
            htmlFor="template"
            className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
          >
            Template
          </label>
          <select
            name="template"
            className="shadow-sm focus:ring-pink-500 focus:border-pink-500 w-1/2 block sm:text-sm rounded-md py-1 text-gray-700 border-pink-300 border-2"
            onChange={e => {
              setTemplate(e.target.value);
              setTemplateParams((templates as Record<string, JSONSchema7>)[e.target.value] || {});
            }}
            value={template}
          >
            <option value="">Please Select</option>
            {Object.keys(templates).map(template => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>
        </div>
        <div className="flex content-center justify-center mt-4">
          <TemplateParameters 
            ref={templateParamsRef}
            templateName={template} 
            template={templateParams} 
          />
        </div>
        {problem && (
          <div className="flex flex-col content-center justify-center mt-8 p-2 text-red-500 rounded-md bg-red-100">
            <div className='flex flex-row text-sm leading-5'>
              <div>
                <span className="text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block h-5 w-5 mr-2 -mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <div>
                {problem.title}
              </div>
            </div>
            {problem.validationErrors ? (
              <ul className='text-xs mt-2 list-disc pl-7'>
                {problem.validationErrors.map(error => (
                  <li key={error.message}>
                    {error.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-xs mt-2 pl-7'>
                {problem.detail}
              </p>
            )}
          </div>
        )}
      </div>
    </ConfirmModal>
  );
};