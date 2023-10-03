/* eslint-disable sonarjs/no-nested-template-literals, sonarjs/no-duplicate-string */

import React, { useEffect, useState } from 'react';

import { useServices } from '../services';
import { useDocumentsState, useFilesState } from '../state';

import type { AsyncAPIDocumentInterface } from '@asyncapi/parser/cjs';

interface NavigationProps {
  className?: string;
}

interface NavigationSectionProps {
  document: AsyncAPIDocumentInterface;
  rawSpec: string;
  hash: string;
}

const ServersNavigation: React.FunctionComponent<NavigationSectionProps> = ({
  document,
  hash,
}) => {
  const { navigationSvc } = useServices();

  return (
    <>
      <div
        className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
          hash === 'servers' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo('/servers', 'servers')
        }
      >
        Servers
      </div>
      <ul>
        {document.servers().all().map((server) => {
          const serverName = server.id();
          return <li
            key={serverName}
            className={`p-2 pl-3 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 ${
              hash === `server-${serverName}` ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              navigationSvc.scrollTo(
                `/servers/${serverName.replace(/\//g, '~1')}`,
                `server-${serverName}`,
              )
            }
          >
            <div className="flex flex-row">
              <div className="flex-none">
                <span className="mr-3 text-xs uppercase text-pink-500 font-bold">
                  {server.protocolVersion()
                    ? `${server.protocol()} ${server.protocolVersion()}`
                    : server.protocol()}
                </span>
              </div>
              <span className="truncate">{serverName}</span>
            </div>
          </li>
        })}
      </ul>
    </>
  );
};

const ChannelsNavigation: React.FunctionComponent<NavigationSectionProps> = ({
  document,
  hash,
}) => {
  const { navigationSvc } = useServices();

  const channels = document.channels().all().map(
    (channel) => {
      return  <li
        key={channel.id()}
        className={`p-2 pl-3 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 ${
          hash === `channels-${channel.id()}` ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            `/channels/${(channel.id() ?? '').replace(/\//g, '~1')}`,
            `channels-${channel.id()}`,
          )
        }
      >
        <div className="flex flex-row">
          <div className="flex-none">
            <span className="mr-3 text-xs uppercase text-blue-500 font-bold">
              {channel.id()}
            </span>
          </div>
          <span className="truncate">{channel.address()}</span>
        </div>
      </li>
    },
  );

  return (
    <>
      <div
        className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
          hash === 'channels' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            '/channels',
            'channels',
          )
        }
      >
        Channels
      </div>
      <ul>{channels}</ul>
    </>
  );
};

const OperationsNavigation: React.FunctionComponent<NavigationSectionProps> = ({
  document,
  hash,
}) => {
  const { navigationSvc } = useServices();

  const operations = document.operations().all().map(
    (operation) => {
      const operations: React.ReactNode[] = [];
      if (operation.isReceive()) {
        operations.push(
          <li
            key={operation.id()}
            className={`p-2 pl-3 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 ${
              hash === `operation-receive-${operation.id()}` ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              navigationSvc.scrollTo(
                `/operations/${(operation.id() ?? '').replace(/\//g, '~1')}`,
                `operation-receive-${operation.id()}`,
              )
            }
          >
            <div className="flex flex-row">
              <div className="flex-none">
                <span className="mr-3 text-xs uppercase text-blue-500 font-bold">
                  Receive
                </span>
              </div>
              <span className="truncate">{operation.id()}</span>
            </div>
          </li>
        );
      }
      if (operation.isSend()) {
        operations.push(
          <li
            key={`${operation.id()}-send`}
            className={`p-2 pl-3 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 ${
              hash === `operation-send-${operation.id()}` ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              navigationSvc.scrollTo(
                `/operations/${(operation.id() ?? '').replace(/\//g, '~1')}`,
                `operation-send-${operation.id()}`,
              )
            }
          >
            <div className="flex flex-row">
              <div className="flex-none">
                <span className="mr-3 text-xs uppercase text-green-600 font-bold">
                  Send
                </span>
              </div>
              <span className="truncate">{operation.id()}</span>
            </div>
          </li>,
        );
      }

      return operations;
    },
  );

  return (
    <>
      <div
        className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
          hash === 'operations' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            '/operations',
            'operations',
          )
        }
      >
        Operations
      </div>
      <ul>{operations}</ul>
    </>
  );
};

const MessagesNavigation: React.FunctionComponent<NavigationSectionProps> = ({
  document,
  hash,
}) => {
  const { navigationSvc } = useServices();

  const messages = document.components().messages().all().map(
    message => {
      const messageName = message.id();
      return <li
        key={messageName}
        className={`p-2 pl-6 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 truncate ${
          hash === `message-${messageName}` ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            `/components/messages/${messageName.replace(/\//g, '~1')}`,
            `message-${messageName}`,
          )
        }
      >
        {messageName}
      </li>
    },
  );

  return (
    <>
      <div
        className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
          hash === 'messages' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            '/components/messages',
            'messages',
          )
        }
      >
        Messages
      </div>
      <ul>{messages}</ul>
    </>
  );
};

const SchemasNavigation: React.FunctionComponent<NavigationSectionProps> = ({
  document,
  hash,
}) => {
  const { navigationSvc } = useServices();

  const schemas = document.components().schemas().all().map(
    schema => {
      const schemaName = schema.id();
      return <li
        key={schemaName}
        className={`p-2 pl-6 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 truncate ${
          hash === `schema-${schemaName}` ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            `/components/schemas/${schemaName.replace(/\//g, '~1')}`,
            `schema-${schemaName}`,
          )
        }
      >
        {schemaName}
      </li>
    }
  );

  return (
    <>
      <div
        className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
          hash === 'schemas' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            '/components/schemas',
            'schemas',
          )
        }
      >
        Schemas
      </div>
      <ul>{schemas}</ul>
    </>
  );
};

export const Navigationv3: React.FunctionComponent<NavigationProps> = ({
  className = '',
}) => {
  const [hash, setHash] = useState(window.location.hash);

  const { navigationSvc } = useServices();
  const rawSpec = useFilesState(state => state.files['asyncapi']?.content);
  const document = useDocumentsState(state => state.documents['asyncapi']?.document);

  useEffect(() => {
    const fn = () => {
      // remove `#` char
      const h = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
      setHash(h);
    };
    fn();
    window.addEventListener('hashchange', fn);
    return () => {
      window.removeEventListener('hashchange', fn);
    };
  }, []);

  if (!rawSpec || !document) {
    return (
      <div className="flex overflow-hidden bg-gray-800 h-full justify-center items-center text-center text-white text-md px-6">
        Empty or invalid document. Please fix errors/define AsyncAPI document.
      </div>
    );
  }

  const components = document.components();
  return (
    <div className={`flex flex-none flex-col overflow-y-auto overflow-x-hidden bg-gray-800 h-full ${className}`}>
      <ul>
        <li className="mb-4">
          <div
            className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
              hash === 'introduction' ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              navigationSvc.scrollTo(
                '/info',
                'introduction',
              )
            }
          >
            Information
          </div>
        </li>
        {!document.servers().isEmpty() && (
          <li className="mb-4">
            <ServersNavigation
              document={document}
              rawSpec={rawSpec}
              hash={hash}
            />
          </li>
        )}
        <li className="mb-4">
          <ChannelsNavigation
            document={document}
            rawSpec={rawSpec}
            hash={hash}
          />
        </li>
        <li className="mb-4">
          <OperationsNavigation
            document={document}
            rawSpec={rawSpec}
            hash={hash}
          />
        </li>
        {!components.messages().isEmpty() && (
          <li className="mb-4">
            <MessagesNavigation
              document={document}
              rawSpec={rawSpec}
              hash={hash}
            />
          </li>
        )}
        {!components.schemas().isEmpty() && (
          <li className="mb-4">
            <SchemasNavigation
              document={document}
              rawSpec={rawSpec}
              hash={hash}
            />
          </li>
        )}
      </ul>
    </div>
  );
};