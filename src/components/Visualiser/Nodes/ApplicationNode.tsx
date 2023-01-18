import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { OldAsyncAPIDocument as AsyncAPIDocument } from '@asyncapi/parser/cjs';

import { useServices } from '../../../services';
import { Markdown } from '../../common';

import type { FunctionComponent } from 'react';

interface IData {
  spec: AsyncAPIDocument
}

interface ApplicationNodeProps {
  data: IData
}

const buildNodeData = (spec: AsyncAPIDocument) => {
  const servers = spec.servers();

  const mappedServers = Object.keys(servers).reduce((newMappedServers: any[], serverKey) => {
    const server = servers[String(serverKey)];

    newMappedServers.push({
      name: serverKey,
      url: server.url(),
      description: server.description(),
      protocol: server.protocol(),
      protocolVersion: server.protocolVersion(),
    });
    return newMappedServers;
  }, []);

  const specInfo = spec.info();

  return {
    defaultContentType: spec.defaultContentType(),
    description: specInfo.description(),
    title: specInfo.title(),
    version: specInfo.version(),
    license: {
      name: specInfo.license() && specInfo.license()?.name(),
      url: specInfo.license() && specInfo.license()?.url(),
    },
    // @ts-ignore
    externalDocs: spec.externalDocs() && spec.externalDocs().url(),
    servers: mappedServers,
  };
};

export const ApplicationNode: FunctionComponent<ApplicationNodeProps> = ({
  data: { spec } = {},
}) => {
  const { navigationSvc } = useServices();
  const [highlight, setHighlight] = useState(false);
  const { description, title, version, license, externalDocs, servers, defaultContentType } = buildNodeData(spec as AsyncAPIDocument);

  useEffect(() => {
    return navigationSvc.highlightVisualiserNode('#server', setHighlight);
  }, [navigationSvc, setHighlight]);

  return (
    <div className={`flex transition duration-500 ease-out shadow sm:rounded-lg border-2 ${highlight ? 'bg-gray-300 border-gray-600' : 'bg-white border-gray-300'}`}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'gray' }}
      />
      <div className="flex justify-center items-center border-r border-gray-200">
        <span className="block transform -rotate-90 uppercase text-blue-500 w-full font-bold tracking-widest px-2 ">
          In
        </span>
      </div>
      <div>
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between mb-4">
            <span className="block leading-6 text-gray-900 uppercase text-xs font-light">
              application
            </span>
          </div>

          <div className="flex space-x-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
            <span className="block leading-6 px-1.5  rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              v{version}
            </span>
          </div>
          {description && (
            <div className="mt-2 text-sm text-gray-500 max-w-xl">
              <Markdown>
                {description}
              </Markdown>
            </div>
          )}
          {defaultContentType && (
            <p className="mt-5 text-xs text-gray-500 ">
              Default ContentType:{' '}
              <span className="bg-gray-100 text-gray-500 py-0.5 px-0.5 rounded-md">
                {defaultContentType}
              </span>
            </p>
          )}
        </div>

        {servers.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Servers</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 mt-4">
              {servers.map((server) => {
                return (
                  <div key={server.name} className="sm:col-span-1">
                    <dt className="text-sm text-gray-500 font-bold flex">
                      {server.name}
                      <span className="block ml-4 leading-6 px-1.5  rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {server.protocolVersion
                          ? `${server.protocol} ${server.protocolVersion}`
                          : server.protocol}
                      </span>
                    </dt>
                    <dd className="mt-1 text-xs text-gray-900">
                      <Markdown>
                        {server.description}
                      </Markdown>
                    </dd>
                    <dd className="mt-1 text-xs text-gray-900">url: {server.url}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        )}

        <div className="text-right text-xs mt-10 space-y-2 italic py-5 sm:px-6">
          {externalDocs && (
            <a
              href={externalDocs}
              target="_blank"
              className="underline  text-blue-400"
              rel="noreferrer"
            >
              {externalDocs}
            </a>
          )}
          {license.name && (
            <a
              href={license.url as string}
              target="_blank"
              className="block text-gray-400 underline"
              rel="noreferrer"
            >
              License: {license.name}
            </a>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center  border-l border-gray-2">
        <span className="block transform -rotate-90 uppercase text-green-500 w-full font-bold tracking-widest">
          Out
        </span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: 'gray' }} />
    </div>
  );
};

export default ApplicationNode;