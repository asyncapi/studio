import { EditorTab } from './EditorTab';

import { usePanelsState } from '../../state';

import type { FunctionComponent } from 'react';

interface TabsProps {}

export const Tabs: FunctionComponent<TabsProps> = () => {
  const tabs = usePanelsState(state => state.panels['primary']?.tabs) || [];
  if (tabs.length === 0) {
    return null;
  }

  return (
    <ul className='flex flex-row'>
      {tabs.map(tab => (
        <li key={tab.id}>
          <EditorTab tab={tab} />
        </li>
      ))}
    </ul>
  );
};
