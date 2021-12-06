import React, { useContext, useState } from 'react';

import { VscClose, VscAdd, VscSplitHorizontal, VscSplitVertical, VscEllipsis } from 'react-icons/vsc';
import { PanelsManager } from '../../services';
import { Visualiser } from '../Visualiser';
import { PanelContext } from './PanelContext';

export interface PanelTab {
  name: string;
  tab: React.ReactNode;
  content: React.ReactNode;
}

interface PanelTabsProps {
  tabs: Array<PanelTab>;
  active?: string;
}

export const PanelTabs: React.FunctionComponent<PanelTabsProps> = ({
  tabs: propTabs = [],
  active,
}) => {
  const { currentPanel } = useContext(PanelContext);

  const [tabs, setTabs] = useState(propTabs);
  const [activeTab, setActiveTab] = useState(active || propTabs[0].name);

  function addTab(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.stopPropagation();

    const newTabs = [...tabs];
    newTabs.push({
      name: 'visualiser',
      tab: <span>Visualiser</span>,
      content: (
        <Visualiser />
      ),
    });

    setActiveTab(newTabs[newTabs.length - 1].name);
    setTabs(newTabs);
  }

  function removeTab(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, tabName: string) {
    event.stopPropagation();

    const newTabs = tabs.filter(oldTab => oldTab.name !== tabName);
    const currentTabIndex = tabs.findIndex(oldTab => oldTab.name === activeTab);
    const newActiveIndex = currentTabIndex - 1 < 0 ? 0 : currentTabIndex - 1;

    const currentTab = newTabs[newActiveIndex];
    if (currentTab) {
      setActiveTab(currentTab.name);
    } else {
      setActiveTab('');
    }
    setTabs(newTabs);
  }

  return (
    <div className="flex flex-col h-full min-h-full">
      <div
        className="flex flex-none flex-row justify-between items-center text-white font-bold text-xs border-b border-gray-700 bg-gray-800 text-sm w-full"
      >
        <ul className="flex flex-none flex-row">
          {tabs.map(tab => (
            <li 
              key={tab.name}
              className='border-r border-gray-700 cursor-pointer'
            >
              <div
                className={`group leading-7 px-3 cursor-pointer border-t-2 ${
                  activeTab === tab.name
                    ? 'text-white border-pink-500'
                    : 'text-gray-500 border-gray-800'
                } focus:outline-none border-box`}
                onClick={() => setActiveTab(tab.name)}
              >
                <div
                  className='border-box border-b-2 border-gray-800'
                >
                  <div className="inline-block">
                    {tab.tab}
                  </div>
                  <button 
                    className={`inline ml-1 ${
                      activeTab === tab.name
                        ? 'text-white'
                        : 'text-gray-800 group-hover:text-gray-500'
                    }`}
                    onClick={(e) => removeTab(e, tab.name)}
                  >
                    <VscClose className="inline-block w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button 
          className="flex-none border-r border-gray-700 h-full leading-7 px-2"
          onClick={(e) => addTab(e)}
        >
          <VscAdd className="inline-block" />
        </button>
        <div className="flex flex-1 flex-row justify-end h-full leading-8">
          <div className="border-r border-gray-700 px-2">
            options
          </div>
          <div className="px-2">
            <button 
              onClick={() => PanelsManager.addPanel(currentPanel, 'horizontal')}
            >
              <VscSplitHorizontal className="inline-block" />
            </button>
            <button 
              className="ml-2"
              onClick={() => PanelsManager.addPanel(currentPanel, 'vertical')}
            >
              <VscSplitVertical className="inline-block" />
            </button>
            <button 
              className="ml-2"
              onClick={(e) => addTab(e)}
            >
              <VscEllipsis className="inline-block" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-1 relative">
        <ul>
          {tabs.map(tab => (
            <li
              key={tab.name}
              className={`${activeTab === tab.name ? 'block' : 'hidden'}`}
            >
              <div className="absolute overflow-auto h-auto top-0 bottom-0 right-0 left-0">
                {tab.content}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // return (
  //   <div className="flex flex-col">
  //     <div
  //       className="flex flex-row justify-between items-center text-white font-bold text-xs cursor-pointer"
  //     >
  //       <ul className="flex flex-row">
  //         {tabs.map(tab => (
  //           <li 
  //             key={tab.name}
  //             className='border-r border-gray-700'
  //           >
  //             <div
  //               className={`leading-7 pl-3 pr-6 cursor-pointer border-t-2 ${
  //                 activeTab === tab.name
  //                   ? 'text-white border-pink-500'
  //                   : 'text-gray-500 border-gray-800'
  //               } focus:outline-none border-box`}
  //               onClick={() => setActiveTab(tab.name)}
  //             >
  //               <div
  //                 className='border-box border-b-2 border-gray-800'
  //               >
  //                 <span>{tab.tab}</span>
  //                 <span></span>
  //               </div>
  //             </div>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //     <div
  //       className="overflow-auto h-auto bottom-0 right-0 left-0"
  //       // style={{ top: '30px' }}
  //     >
  //       <ul>
  //         {tabs.map(tab => (
  //           <li
  //             key={tab.name}
  //             className={`${activeTab === tab.name ? 'block' : 'hidden'}`}
  //           >
  //             {tab.content}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   </div>
  // );
};
