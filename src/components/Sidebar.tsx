import React from 'react';
import { VscFiles, VscExtensions, VscNewFile } from 'react-icons/vsc';

import state from '../state';

type NavItemType = 'explorer' | 'tools' | 'templates';

function setActiveNav(navItem: NavItemType) {
  state.sidebar.activePanel.set(previous => previous === navItem ? false : navItem);
}

// interface SidebarItemProps {
//   id: string;
//   icon: React.ReactNode;
// }

// const SidebarItem: React.FunctionComponent<SidebarItemProps> = ({
//   id,
//   icon,
// }) => {
//   const [_, drag] = useDrag({
//     type: DRAG_DROP_TYPES.TOOL,
//     item: { toolID: id },
//   });

//   return (
//     <button
//       ref={drag}
//       // onClick={() => PanelsManager.addNewTool(activePanel, name)}
//       className='flex text-sm text-gray-500 hover:text-white focus:outline-none border-box p-4'
//       type="button"
//     >
//       <div className="relative">
//         <div>
//           {icon}
//         </div>
//         <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-pink-500 rounded-full text-white">
//           <div className="flex h-full w-full justify-center items-center">
//             <VscAdd className="w-2.5 h-2.5" />
//           </div>
//         </div>
//       </div>
//     </button>
//   );
// }

interface NavItem {
  name: string;
  icon: React.ReactNode;
}

interface SidebarProps {}

export const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  const sidebarState = state.useSidebarState();
  const activePanel = sidebarState.activePanel.get();

  if (sidebarState.show.get() === false) {
    return null;
  }

  const navigation: NavItem[] = [
    // explorer
    {
      name: 'explorer',
      icon: <VscFiles className="w-5 h-5" />,
    },
    // tools
    {
      name: 'tools',
      icon: <VscExtensions className="w-5 h-5" />,
    },
    // templates
    {
      name: 'templates',
      icon: <VscNewFile className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex flex-col flex-none bg-gray-800 shadow-lg border-r border-gray-700">
      {navigation.map(item => (
        <button
          key={item.name}
          onClick={() => setActiveNav(item.name as NavItemType)}
          className={`flex text-sm border-l-2 ${
            item.name === activePanel
              ? 'text-white border-white'
              : 'text-gray-500 hover:text-white border-gray-800'
          } focus:outline-none border-box p-4`}
          type="button"
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};
