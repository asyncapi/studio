import React from 'react';
import { IoGlobeOutline, IoLogoGithub, IoLogoSlack } from 'react-icons/io5';

interface ToolbarProps {}

export const Toolbar: React.FunctionComponent<ToolbarProps> = () => {
  return (
    <div>
      <div className="px-2 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 ml-1.5">
              <img
                className="inline-block h-16"
                src={`${process.env.PUBLIC_URL}/img/logo-studio.svg`}
                alt="AsyncAPI Logo"
              />
              <span className="inline-block text-xs text-teal-500 font-normal ml-1 tracking-wider uppercase" style={{ transform: 'translateY(0.3125rem)' }}>
                beta
              </span>
            </div>
          </div>
          <ul className="flex items-center text-pink-500 mr-2">
            <li className="text-xl opacity-75 hover:opacity-100">
              <a href='https://asyncapi.com' title='AsyncAPI Website' target='_blank' rel="noreferrer">
                <IoGlobeOutline />
              </a>
            </li>
            <li className="text-xl ml-2 opacity-75 hover:opacity-100">
              <a href='https://github.com/asyncapi' title='AsyncAPI Github Organization' target='_blank' rel="noreferrer">
                <IoLogoGithub />
              </a>
            </li>
            <li className="text-xl ml-2 opacity-75 hover:opacity-100">
              <a href='https://asyncapi.com/slack-invite' title='AsyncAPI Slack Workspace' target='_blank' rel="noreferrer">
                <IoLogoSlack />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
