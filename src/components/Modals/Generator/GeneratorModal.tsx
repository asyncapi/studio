import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { create, useModal } from '@ebay/nice-modal-react';

import { ConfirmModal } from '../index';
import { TemplateParameters, TemplateParametersHandle } from './TemplateParameters';

import { useServices } from '../../../services';
import { ServerAPIProblem } from '../../../services/server-api.service';

import { filesState } from '../../../state';

import templates from './template-parameters.json';

export const GeneratorModal = create(() => {
  const modal = useModal();
  const [template, setTemplate] = useState('');
  const { serverAPISvc } = useServices();
  const [problem, setProblem] = useState<ServerAPIProblem & { validationErrors: any[] } | null>(null);
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const templateParamsRef = useRef<TemplateParametersHandle>(null);

  useEffect(() => {
    const required = template ? (templates as Record<string, any>)[String(template)].schema.required : [];
    setConfirmDisabled(!template || required.length !== 0);
    setProblem(null);
  }, [template, setProblem]);

  const generateTemplate = async () => {
    setProblem(null);
    const response = await serverAPISvc.generate({
      asyncapi: filesState.getState().files['asyncapi'].content,
      template,
      parameters: templateParamsRef.current?.getValues(),
    });

    if (response.ok) {
      modal.hide();
      setTemplate('');
    } else {
      const responseProblem = await serverAPISvc.retrieveProblem<{ validationErrors: string[] }>(response);
      setProblem(responseProblem as ServerAPIProblem & { validationErrors: string[] });
      throw new Error(responseProblem?.title);
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

  const onCancel = () => {
    setTimeout(() => {
      setTemplate('');
      setProblem(null);
      setConfirmDisabled(true);
      modal.hide();
    }, 200);
  };

  return (
    <ConfirmModal
      title="Generate code/docs based on your AsyncAPI Document"
      confirmText="Generate"
      confirmDisabled={confirmDisabled}
      onSubmit={onSubmit}
      onCancel={onCancel}
      closeAfterSumbit={false}
    >
      <div>
        <div className="flex flex-row content-center justify-between text-sm">
          <label
            htmlFor="generate"
            className="flex justify-right items-center w-1/2 content-center font-medium text-gray-700"
          >
            Generate
          </label>
          <select
            name="generate"
            className="shadow-sm focus:ring-pink-500 focus:border-pink-500 w-1/2 block sm:text-sm rounded-md py-1 text-gray-700 border-pink-300 border-2"
            onChange={e => {
              setTemplate(e.target.value);
            }}
            value={template}
          >
            <option value="">Please Select</option>
            {Object.keys(templates).map(templateItem => (
              <option key={templateItem} value={templateItem}>
                {(templates as Record<string, any>)[String(templateItem)]?.title}
              </option>
            ))}
          </select>
        </div>
        {template && (
          <div className='text-gray-400 text-xs mt-2 text-right'>
            <p>
              <a 
                target="_blank" 
                href={`https://github.com/asyncapi/${template.replace('@asyncapi/', '')}`}
                className="underline text-pink-500" 
                rel="noreferrer"
              >
                Link to the Github Repository of selected generation &rarr;
              </a>
            </p>
          </div>
        )}
        <div className="flex content-center justify-center">
          <TemplateParameters 
            ref={templateParamsRef}
            templateName={template} 
            template={template ? (templates as Record<string, any>)[String(template)]?.schema : {}} 
            supportedProtocols={template ? (templates as Record<string, any>)[String(template)]?.supportedProtocols : []} 
            setConfirmDisabled={setConfirmDisabled}
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
            {problem.validationErrors && 
              problem.validationErrors.length &&
              problem.validationErrors.filter(error => error.message).length 
              ? (
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
              )
            }
          </div>
        )}
      </div>
    </ConfirmModal>
  );
});
