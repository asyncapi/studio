import React from 'react';

import { PanelTab } from './PanelsTabs';

interface TabContextProps {
  currentTab: string;
  changeTab(tabName: string, newTab: PanelTab): void,
}

export const TabContext = React.createContext<TabContextProps>({
  currentTab: '',
  changeTab: () => undefined,
});
