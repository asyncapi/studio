import React from 'react';

import { PanelTab, PanelTabID } from '../../../services';

interface TabContextProps {
  currentTab: PanelTabID;
  tab: PanelTab,
}

export const TabContext = React.createContext<TabContextProps>({
  currentTab: '',
  tab: null as any,
});
