import React from 'react';

import { PanelID } from '../../services';

interface PanelContextProps {
  currentPanel: PanelID,
}

export const PanelContext = React.createContext<PanelContextProps>({
  currentPanel: '',
});