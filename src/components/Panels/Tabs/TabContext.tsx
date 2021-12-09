import React from 'react';

interface TabContextProps {
  currentTab: string;
}

export const TabContext = React.createContext<TabContextProps>({
  currentTab: '',
});
