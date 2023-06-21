/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { VscListSelection, VscCode, VscOpenPreview, VscGraph, VscNewFile, VscSettingsGear } from 'react-icons/vsc';

import { Sidebar } from 'ui';

export default {
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
}

export const WithTopAndBottomItems = {
  args: {
    items: [
      {
        name: 'primarySidebar',
        title: 'Navigation',
        isActive: true,
        onClick: () => {},
        icon: <VscListSelection className="w-5 h-5" />,
        tooltip: 'Navigation',
      },
      {
        name: 'primaryPanel',
        title: 'Editor',
        isActive: false,
        onClick: () => {},
        icon: <VscCode className="w-5 h-5" />,
        tooltip: 'Editor',
      },
      {
        name: 'template',
        title: 'Template',
        isActive: false,
        onClick: () => {},
        icon: <VscOpenPreview className="w-5 h-5" />,
        tooltip: 'HTML preview',
      },
      {
        name: 'visualiser',
        title: 'Visualiser',
        isActive: false,
        onClick: () => {},
        icon: <VscGraph className="w-5 h-5" />,
        tooltip: 'Blocks visualiser',
      },
      {
        name: 'newFile',
        title: 'New file',
        isActive: false,
        onClick: () => {},
        icon: <VscNewFile className="w-5 h-5" />,
        tooltip: 'New file',
      },
      {
        name: 'settings',
        title: 'Settings',
        isActive: false,
        onClick: () => {},
        icon: <VscSettingsGear className="w-5 h-5" />,
        tooltip: 'Settings',
        align: 'bottom'
      }
    ],
  }
};

export const WithTopItemsOnly = {
  args: {
    items: [
      {
        name: 'primarySidebar',
        title: 'Navigation',
        isActive: true,
        onClick: () => {},
        icon: <VscListSelection className="w-5 h-5" />,
        tooltip: 'Navigation',
      },
      {
        name: 'primaryPanel',
        title: 'Editor',
        isActive: false,
        onClick: () => {},
        icon: <VscCode className="w-5 h-5" />,
        tooltip: 'Editor',
      },
      {
        name: 'template',
        title: 'Template',
        isActive: false,
        onClick: () => {},
        icon: <VscOpenPreview className="w-5 h-5" />,
        tooltip: 'HTML preview',
      },
    ],
  }
};

export const WithBottomItemsOnly = {
  args: {
    items: [
      {
        name: 'primarySidebar',
        title: 'Navigation',
        isActive: true,
        onClick: () => {},
        icon: <VscListSelection className="w-5 h-5" />,
        tooltip: 'Navigation',
        align: 'bottom',
      },
      {
        name: 'primaryPanel',
        title: 'Editor',
        isActive: false,
        onClick: () => {},
        icon: <VscCode className="w-5 h-5" />,
        tooltip: 'Editor',
        align: 'bottom',
      },
      {
        name: 'template',
        title: 'Template',
        isActive: false,
        onClick: () => {},
        icon: <VscOpenPreview className="w-5 h-5" />,
        tooltip: 'HTML preview',
        align: 'bottom',
      },
    ],
  }
};

export const NoItems = {
  args: {
    items: [],
  }
};
