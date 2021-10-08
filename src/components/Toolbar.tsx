import React from 'react';
import { IoGlobeOutline, IoLogoGithub, IoLogoSlack } from 'react-icons/io5';

interface ToolbarProps {}

export const Toolbar: React.FunctionComponent<ToolbarProps> = () => {
  return (
    <div>
      <div className="px-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="inline-block h-20"
                src="/img/logo-horizontal-white.svg"
                alt=""
              />
              <span className="inline-block text-xl text-pink-500 font-normal italic tracking-wide -ml-1 transform translate-y-0.5">
                studio
              </span>
            </div>
          </div>
          <ul className="flex items-center text-pink-500">
            <li className="text-2xl opacity-75 hover:opacity-100">
              <a href='https://asyncapi.com' title='AsyncAPI Website'>
                <IoGlobeOutline />
              </a>
            </li>
            <li className="text-2xl ml-2 opacity-75 hover:opacity-100">
              <a href='https://github.com/asyncapi/asyncapi' title='AsyncAPI Github Organization'>
                <IoLogoGithub />
              </a>
            </li>
            <li className="text-2xl ml-2 opacity-75 hover:opacity-100">
              <a href='https://asyncapi.com/slack-invite' title='AsyncAPI Slack Workspace'>
                <IoLogoSlack />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
