import React, { useEffect, useState } from 'react';

import { AsyncAPIDocument } from '@asyncapi/parser';

import state from '../state';
import { NavigationService } from '../services';

interface NavigationProps {}

interface NavigationSectionProps {
  spec: AsyncAPIDocument;
  rawSpec: string;
  language: string;
  hash: string;
}

export const Navigation: React.FunctionComponent<NavigationProps> = () => {
  const [hash, setHash] = useState(window.location.hash);

  const editorState = state.useEditorState();
  const parserState = state.useParserState();

  const rawSpec = editorState.editorValue.get();
  const language = editorState.language.get();
  const spec = parserState.parsedSpec.get();

  useEffect(() => {
    // remove `#` char
    setHash(window.location.hash.substring(1));
    const fn = () => {
      // remove `#` char
      setHash(window.location.hash.substring(1));
    };
    window.addEventListener('hashchange', fn);
    return () => {
      window.removeEventListener('hashchange', fn);
    };
  }, []);

  if (editorState.editorLoaded.get() === false) {
    return (
      <div className="flex overflow-hidden bg-gray-800 h-full justify-center items-center text-center text-white text-md px-6">
        Loading...
      </div>
    );
  }

  if (!rawSpec || !spec || typeof spec === 'string') {
    return (
      <div className="flex overflow-hidden bg-gray-800 h-full justify-center items-center text-center text-white text-md px-6">
        Empty or invalid document. Please fix errors/define AsyncAPI document.
      </div>
    );
  }

  return (
    <div className="flex flex-none flex-col overflow-y-auto overflow-x-hidden bg-gray-800 h-full">
      <ul>
        <li className="mb-4">
          <div
            className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
              hash === 'introduction' ? 'bg-gray-900' : ''
            }`}
            onClick={() =>
              NavigationService.scrollTo(
                '/info',
                rawSpec,
                'introduction',
                language,
              )
            }
          >
            Introduction
          </div>
        </li>
        {spec.hasServers() && (
          <li className="mb-4">
            <ServersNavigation
              spec={spec}
              rawSpec={rawSpec}
              language={language}
              hash={hash}
            />
          </li>
        )}
        <li className="mb-4">
          <OperationsNavigation
            spec={spec}
            rawSpec={rawSpec}
            language={language}
            hash={hash}
          />
        </li>
        {spec.hasComponents() && spec.components().hasMessages() && (
          <li className="mb-4">
            <MessagesNavigation
              spec={spec}
              rawSpec={rawSpec}
              language={language}
              hash={hash}
            />
          </li>
        )}
        {spec.hasComponents() && spec.components().hasSchemas() && (
          <li className="mb-4">
            <SchemasNavigation
              spec={spec}
              rawSpec={rawSpec}
              language={language}
              hash={hash}
            />
          </li>
        )}
      </ul>
    </div>
  );
};

const ServersNavigation: React.FunctionComponent<NavigationSectionProps> = ({
  spec,
  rawSpec,
  language,
  hash,
}) => {
  return (
    <>
      <div
        className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
          hash === 'servers' ? 'bg-gray-900' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo('/servers', rawSpec, 'servers', language)
        }
      >
        Servers
      </div>
      <ul>
        {Object.entries(spec.servers() || {}).map(([serverName, server]) => (
          <li
            key={serverName}
            className={`p-2 pl-3 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 ${
              hash === `server-${serverName}` ? 'bg-gray-900' : ''
            }`}
            onClick={() =>
              NavigationService.scrollTo(
                `/servers/${serverName.replace(/\//g, '~1')}`,
                rawSpec,
                `server-${serverName}`,
                language,
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
        ))}
      </ul>
    </>
  );
};

const OperationsNavigation: React.FunctionComponent<NavigationSectionProps> = ({
  spec,
  rawSpec,
  language,
  hash,
}) => {
  const operations = Object.entries(spec.channels() || {}).map(
    ([channelName, channel]) => {
      const channels: React.ReactNodeArray = [];

      if (channel.hasPublish()) {
        channels.push(
          <li
            key={`${channelName}-publish`}
            className={`p-2 pl-3 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 ${
              hash === `operation-publish-${channelName}` ? 'bg-gray-900' : ''
            }`}
            onClick={() =>
              NavigationService.scrollTo(
                `/channels/${channelName.replace(/\//g, '~1')}`,
                rawSpec,
                `operation-publish-${channelName}`,
                language,
              )
            }
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
      if (channel.hasSubscribe()) {
        channels.push(
          <li
            key={`${channelName}-subscribe`}
            className={`p-2 pl-3 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 ${
              hash === `operation-subscribe-${channelName}` ? 'bg-gray-900' : ''
            }`}
            onClick={() =>
              NavigationService.scrollTo(
                `/channels/${channelName.replace(/\//g, '~1')}`,
                rawSpec,
                `operation-subscribe-${channelName}`,
                language,
              )
            }
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

  return (
    <>
      <div
        className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
          hash === 'operations' ? 'bg-gray-900' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo(
            '/channels',
            rawSpec,
            'operations',
            language,
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
  spec,
  rawSpec,
  language,
  hash,
}) => {
  const messages = Object.keys(spec.components().messages() || {}).map(
    messageName => (
      <li
        key={messageName}
        className={`p-2 pl-6 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 truncate ${
          hash === `message-${messageName}` ? 'bg-gray-900' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo(
            `/components/messages/${messageName.replace(/\//g, '~1')}`,
            rawSpec,
            `message-${messageName}`,
            language,
          )
        }
      >
        {messageName}
      </li>
    ),
  );

  return (
    <>
      <div
        className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
          hash === 'messages' ? 'bg-gray-900' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo(
            '/components/messages',
            rawSpec,
            'messages',
            language,
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
  spec,
  rawSpec,
  language,
  hash,
}) => {
  const schemas = Object.keys(spec.components().schemas() || {}).map(
    schemaName => (
      <li
        key={schemaName}
        className={`p-2 pl-6 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 truncate ${
          hash === `schema-${schemaName}` ? 'bg-gray-900' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo(
            `/components/schemas/${schemaName.replace(/\//g, '~1')}`,
            rawSpec,
            `schema-${schemaName}`,
            language,
          )
        }
      >
        {schemaName}
      </li>
    ),
  );

  return (
    <>
      <div
        className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
          hash === 'schemas' ? 'bg-gray-900' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo(
            '/components/schemas',
            rawSpec,
            'schemas',
            language,
          )
        }
      >
        Schemas
      </div>
      <ul>{schemas}</ul>
    </>
  );
};
