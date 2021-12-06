import React from 'react';

interface PanelContextProps {
  currentPanel: string,
}

export const PanelContext = React.createContext<PanelContextProps>({
  currentPanel: '',
});