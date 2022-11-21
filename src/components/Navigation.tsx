/* eslint-disable sonarjs/no-nested-template-literals, sonarjs/no-duplicate-string */

import React, { useEffect, useState } from 'react';

import { NavigationService } from '../services';
import state from '../state';

import type { OldAsyncAPIDocument as AsyncAPIDocument } from '@asyncapi/parser/cjs';

interface NavigationProps {
  className?: string;
}

interface NavigationSectionProps {
  spec: AsyncAPIDocument;
  rawSpec: string;
  language: string;
  hash: string;
}

const ServersNavigation: React.FunctionComponent<NavigationSectionProps> = ({
  spec,
  hash,
}) => {
  return (
    <>
      <div
        className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
          hash === 'servers' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo('/servers', 'servers')
        }
      >
        Servers
      </div>
      <ul>
        {Object.entries(spec.servers() || {}).map(([serverName, server]) => (
          <li
            key={serverName}
            className={`p-2 pl-3 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 ${
              hash === `server-${serverName}` ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              NavigationService.scrollTo(
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
        ))}
      </ul>
    </>
  );
};

const OperationsNavigation: React.FunctionComponent<NavigationSectionProps> = ({
  spec,
  hash,
}) => {
  const operations = Object.entries(spec.channels() || {}).map(
    ([channelName, channel]) => {
      const channels: React.ReactNode[] = [];

      if (channel.hasPublish()) {
        channels.push(
          <li
            key={`${channelName}-publish`}
            className={`p-2 pl-3 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 ${
              hash === `operation-publish-${channelName}` ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              NavigationService.scrollTo(
                `/channels/${channelName.replace(/\//g, '~1')}`,
                `operation-publish-${channelName}`,
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
              hash === `operation-subscribe-${channelName}` ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              NavigationService.scrollTo(
                `/channels/${channelName.replace(/\//g, '~1')}`,
                `operation-subscribe-${channelName}`,
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
          hash === 'operations' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo(
            '/channels',
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
  spec,
  hash,
}) => {
  const messages = Object.keys(spec.components()?.messages() || {}).map(
    messageName => (
      <li
        key={messageName}
        className={`p-2 pl-6 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 truncate ${
          hash === `message-${messageName}` ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo(
            `/components/messages/${messageName.replace(/\//g, '~1')}`,
            `message-${messageName}`,
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
          hash === 'messages' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo(
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
  spec,
  hash,
}) => {
  const schemas = Object.keys(spec.components()?.schemas() || {}).map(
    schemaName => (
      <li
        key={schemaName}
        className={`p-2 pl-6 text-white cursor-pointer text-xs border-t border-gray-700 hover:bg-gray-900 truncate ${
          hash === `schema-${schemaName}` ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo(
            `/components/schemas/${schemaName.replace(/\//g, '~1')}`,
            `schema-${schemaName}`,
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
          hash === 'schemas' ? 'bg-gray-800' : ''
        }`}
        onClick={() =>
          NavigationService.scrollTo(
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

export const Navigation: React.FunctionComponent<NavigationProps> = ({
  className = '',
}) => {
  const [hash, setHash] = useState(window.location.hash);

  const editorState = state.useEditorState();
  const parserState = state.useParserState();

  const rawSpec = editorState.editorValue.get();
  const language = editorState.language.get();
  const spec = parserState.parsedSpec.get();

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

  if (editorState.editorLoaded.get() === false) {
    return (
      <div className="flex overflow-hidden bg-gray-800 h-full justify-center items-center text-center text-white text-md px-6">
        <div>
          <div className="w-full text-center h-8">
            <div className="rotating-wheel"></div>
          </div>
          <p className="mt-1 text-sm">
            Loading...
          </p>
        </div>
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
    <div className={`flex flex-none flex-col overflow-y-auto overflow-x-hidden bg-gray-800 h-full ${className}`}>
      <ul>
        <li className="mb-4">
          <div
            className={`p-2 pl-3 text-white cursor-pointer hover:bg-gray-900 ${
              hash === 'introduction' ? 'bg-gray-800' : ''
            }`}
            onClick={() =>
              NavigationService.scrollTo(
                '/info',
                'introduction',
              )
            }
          >
            Information
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
        {spec.hasComponents() && spec.components()?.hasMessages() && (
          <li className="mb-4">
            <MessagesNavigation
              spec={spec}
              rawSpec={rawSpec}
              language={language}
              hash={hash}
            />
          </li>
        )}
        {spec.hasComponents() && spec.components()?.hasSchemas() && (
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
