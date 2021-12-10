import React from 'react';

import { PanelTabID } from '../../../services';

interface TabContextProps {
  currentTab: PanelTabID;
}

export const TabContext = React.createContext<TabContextProps>({
  currentTab: '',
});
