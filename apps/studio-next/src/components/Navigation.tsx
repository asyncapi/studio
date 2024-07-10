/* eslint-disable sonarjs/no-nested-template-literals, sonarjs/no-duplicate-string */

import React, { useEffect, useState } from 'react';

import { useServices } from '@/services';
import { useDocumentsState, useFilesState } from '@/state';
import { NAVIGATION_SECTION_STYLE, NAVIGATION_SUB_SECTION_STYLE } from './Navigationv3';
import type { AsyncAPIDocumentInterface } from '@asyncapi/parser';

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
        className={`${NAVIGATION_SECTION_STYLE} ${
          hash === 'servers' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo('/servers', 'servers')
        }
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') navigationSvc.scrollTo('/servers', 'servers');
        }}
      >
        Servers
      </div>
      <ul>
        {document.servers().all().map((server) => {
          const serverName = server.id();
          return <li
            key={serverName}
            className={`${NAVIGATION_SUB_SECTION_STYLE} ${
              hash === `server-${serverName}` ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              navigationSvc.scrollTo(
                `/servers/${serverName.replace(/\//g, '~1')}`,
                `server-${serverName}`,
              )
            }
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') navigationSvc.scrollTo(
                `/servers/${serverName.replace(/\//g, '~1')}`,
                `server-${serverName}`,
              );
            }}
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

const OperationsNavigation: React.FunctionComponent<NavigationSectionProps> = ({
  document,
  hash,
}) => {
  const { navigationSvc } = useServices();
  /* eslint-disable sonarjs/cognitive-complexity */
  const operations = document.operations().all().map(
    (operation) => {
      const channels: React.ReactNode[] = [];
      // only has one channel per operation 
      let channelName = 'Unknown';
      if (!operation.channels().isEmpty()) {
        channelName = operation.channels().all()[0].address() ?? 'Unknown';
      }
      if (operation.isReceive()) {
        channels.push(
          <li
            key={`${channelName}-publish`}
            className={`${NAVIGATION_SUB_SECTION_STYLE} ${
              hash === `operation-publish-${channelName}` ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              navigationSvc.scrollTo(
                `/channels/${channelName.replace(/\//g, '~1')}`,
                `operation-publish-${channelName}`,
              )
            }
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') navigationSvc.scrollTo(
                `/channels/${channelName.replace(/\//g, '~1')}`,
                `operation-publish-${channelName}`,
              );
            }}
          >
            <div className="flex flex-row">
              <div className="flex-none">
                <span className="mr-3 text-xs uppercase text-blue-500 font-bold">
                  Pub
                </span>
              </div>
              <span className="truncate">{channelName}</span>
            </div>
          </li>,
        );
      }
      if (operation.isSend()) {
        channels.push(
          <li
            key={`${channelName}-subscribe`}
            className={`${NAVIGATION_SUB_SECTION_STYLE} ${
              hash === `operation-subscribe-${channelName}` ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              navigationSvc.scrollTo(
                `/channels/${channelName.replace(/\//g, '~1')}`,
                `operation-subscribe-${channelName}`,
              )
            }
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ')  navigationSvc.scrollTo(
                `/channels/${channelName.replace(/\//g, '~1')}`,
                `operation-subscribe-${channelName}`,
              );
            }}
          >
            <div className="flex flex-row">
              <div className="flex-none">
                <span className="mr-3 text-xs uppercase text-green-600 font-bold">
                  Sub
                </span>
              </div>
              <span className="truncate">{channelName}</span>
            </div>
          </li>,
        );
      }

      return channels;
    },
  );
  /* eslint-enable sonarjs/cognitive-complexity */
  return (
    <>
      <div
        className={`${NAVIGATION_SECTION_STYLE} ${
          hash === 'operations' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            '/channels',
            'operations',
          )
        }
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ')  navigationSvc.scrollTo(
            '/channels',
            'operations',
          );
        }}
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
        className={`${NAVIGATION_SUB_SECTION_STYLE} truncate ${
          hash === `message-${messageName}` ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            `/components/messages/${messageName.replace(/\//g, '~1')}`,
            `message-${messageName}`,
          )
        }
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') navigationSvc.scrollTo(
            `/components/messages/${messageName.replace(/\//g, '~1')}`,
            `message-${messageName}`,
          );
        }}
      >
        {messageName}
      </li>
    },
  );

  return (
    <>
      <div
        className={`${NAVIGATION_SECTION_STYLE} ${
          hash === 'messages' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            '/components/messages',
            'messages',
          )
        }
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') navigationSvc.scrollTo(
            '/components/messages',
            'messages',
          );
        }}
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
        className={`${NAVIGATION_SUB_SECTION_STYLE} truncate ${
          hash === `schema-${schemaName}` ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            `/components/schemas/${schemaName.replace(/\//g, '~1')}`,
            `schema-${schemaName}`,
          )
        }
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') navigationSvc.scrollTo(
            `/components/schemas/${schemaName.replace(/\//g, '~1')}`,
            `schema-${schemaName}`,
          );
        }}
      >
        {schemaName}
      </li>
    }
  );

  return (
    <>
      <div
        className={`${NAVIGATION_SECTION_STYLE} ${
          hash === 'schemas' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          navigationSvc.scrollTo(
            '/components/schemas',
            'schemas',
          )
        }
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') navigationSvc.scrollTo(
            '/components/schemas',
            'schemas',
          );
        }}
      >
        Schemas
      </div>
      <ul>{schemas}</ul>
    </>
  );
};

export const Navigation: React.FunctionComponent<NavigationProps> = ({
  className = '',
}) => {
  const [hash, setHash] = useState(window.location.hash);
  const [loading, setloading] = useState(false);

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
  
  useEffect(() => {
    if (!document) {
      setloading(true);
      const timer = setTimeout(() => {
        setloading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  },[document])

  if (!rawSpec || !document) {
    return (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center bg-gray-800">
        {loading ?(
          <div className="rotating-wheel"></div>
        ) : (
          <p className='text-white'>Empty or invalid document. Please fix errors/define AsyncAPI document.</p>
        )
        }
      </div>
    );
  }

  const components = document.components();
  return (
    <div className={`flex flex-none flex-col overflow-y-auto overflow-x-hidden bg-gray-800 h-full ${className}`}>
      <ul>
        <li className="mb-4">
          <div
            className={`${NAVIGATION_SECTION_STYLE} ${
              hash === 'introduction' ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              navigationSvc.scrollTo(
                '/info',
                'introduction',
              )
            }
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') navigationSvc.scrollTo(
                '/info',
                'introduction',
              );
            }}
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
