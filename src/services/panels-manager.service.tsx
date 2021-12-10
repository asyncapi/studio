import { HTMLWrapper, MonacoWrapper } from '../components';
import { Terminal } from '../components/Terminal';
import { Visualiser } from '../components/Visualiser';

import { Orientation } from '../components/Split/sash';

import { generateUniqueID } from '../helpers';

import state from '../state';
import { NewTab } from '../components/Panels/Tabs';

export type ToolID = string;
export interface Tool {
  id: ToolID,
  tab: () => React.ReactNode,
  content: () => React.ReactNode,
}

const tools = [
  {
    title: 'Editor',
    description: () => <>A Editor</>,
    id: 'editor',
    tab: () => (
      <span>Editor</span>
    ),
    content: () => <MonacoWrapper />
  },
  {
    title: 'HTML Template',
    description: () => <>A HTML template</>,
    id: 'html',
    tab: () => (
      <span>HTML</span>
    ),
    content: () => <HTMLWrapper />
  },
  {
    title: 'Visualiser',
    description: () => <>A Visualiser</>,
    id: 'visualiser',
    tab: () => (
      <span>Visualiser</span>
    ),
    content: () => <Visualiser />
  },
  {
    title: 'Terminal',
    description: () => <>A Terminal</>,
    id: 'terminal',
    tab: () => (
      <span>Terminal</span>
    ),
    content: () => <Terminal />
  },
];

export enum DRAG_DROP_TYPES {
  PANEL = 'PANEL',
  TAB = 'TAB',
  TOOL = 'TOOL',
  FILE = 'FILE',
}

export enum DropDirection {
  CENTER = 'CENTER',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export type PanelID = string;
export interface Panel {
  id: PanelID;
  direction?: Orientation;
  panels?: string[];
  tabs?: PanelTab[];
  activeTab?: string;
  parent?: string;
}

export type PanelTabID = string;
export enum PanelTabType {
  FILE = 'FILE',
  TOOL = 'TOOL',
  EMPTY = 'EMPTY',
};
export interface PanelTab<M extends Record<string, any> = Record<string, any>> {
  id: PanelTabID;
  type: PanelTabType,
  tab: React.ReactNode;
  content: React.ReactNode;
  metadata?: M;
}

// export class PanelsManager {
//   private static panels: Array<Panel> = [];

//   private static tabs: Map<string, {
//     activeTab: string,
//     tabs: PanelTab[],
//     setActiveTab: React.Dispatch<React.SetStateAction<string>>,
//     setTabs: React.Dispatch<React.SetStateAction<PanelTab[]>>,
//   }> = new Map();

//   public onInitPanel() {

//   }

//   static getPanel(id: PanelID): Panel | undefined {
//     return this.panels.find(p => p.id === id);
//   }

//   static getTab__NEW(id: TabID, panelID?: string): PanelTab | undefined {
//     if (panelID) {
//       const panelTabs = this.tabs.get(panelID);
//       if (!panelTabs) {
//         return;
//       }
//       return panelTabs.tabs.find(t => t.id === id);
//     }
//   }

//   static createPanel(parentPanel: string, direction?: DropDirection): Panel | undefined {
//     return;
//   }

//   static removePanel__NEW(id: string): void {

//   }

//   static addPanel(panelID: string, direction: DropDirection): string | undefined {
//     let parent: State<Panel> | undefined;
//     parent = state.panels.panels.find(panel => {
//       const panels = panel.panels.get();
//       if (panels?.includes(panelID)) return true;
//       return false;
//     });
//     if (!parent) {
//       return;
//     }
    
//     const newPanel = generateUniqueID();
//     if (direction === DropDirection.TOP || direction === DropDirection.BOTTOM) {
//       state.panels.panels.merge([
//         {
//           id: newPanel,
//         },
//       ]);
//       parent.set(oldParent => {
//         const panels = oldParent.panels!;
//         const index = panels.findIndex(panel => panel === panelID);
//         const newPanels = [...panels];
//         newPanels.splice(direction === DropDirection.TOP ? index : index + 1, 0, newPanel);
//         oldParent.panels = newPanels;
//         return oldParent;
//       });
//     } else {
//       state.panels.panels.merge([
//         {
//           id: `${newPanel}-group`,
//           direction: Orientation.Vertical,
//           panels: [newPanel],
//         },
//         {
//           id: newPanel,
//         },
//       ]);
//       const group = state.panels.panels.find(panel => panel.id.get() === 'group-1');
//       if (!group) {
//         return;
//       }

//       group.set(oldGroup => {
//         const panels = oldGroup.panels!;
//         const index = panels.findIndex(panel => panel === parent!.id.get());
//         const newPanels = [...panels];
//         newPanels.splice(direction === DropDirection.LEFT ? index : index + 1, 0, `${newPanel}-group`);
//         oldGroup.panels = newPanels;
//         return oldGroup;
//       });
//     }
//     state.panels.activePanel.set(newPanel);
//     return newPanel;
//   }

//   static addPanelNew(
//     panelID: string, 
//     direction: DropDirection,
//     type: 'tool' | 'tab',
//     toolOrTab: any,
//   ): void {
//     const newPanel = this.addPanel(panelID, direction);
//     if (!newPanel) {
//       return;
//     }

//     if (type === 'tool') {
//       this.addNewTool(newPanel, toolOrTab.toolName);
//       return;
//     }
//     this.switchTabs(toolOrTab.panelID, newPanel, toolOrTab.tabID, 0);
//   }

//   static removePanel(panelID: string) {
//     state.panels.panels.set(oldPanels => {
//       let newPanels = oldPanels
//         .filter(panel => panel.id !== panelID)
//         .map(panel => {
//           if (panel.panels) {
//             return {
//               ...panel,
//               panels: panel.panels.filter(p => p !== panelID),
//             };
//           }
//           return { ...panel };
//         });
//       newPanels = newPanels
//         .filter(panel => {
//           if (panel.id === `${panelID}-group` && panel.panels?.length === 0) {
//             return false;
//           }
//           return true;
//         });
//       // group
//       newPanels[1].panels = newPanels[1].panels?.filter(panel => {
//         if (panel === `${panelID}-group`) {
//           const p = newPanels.find(e => e.id === `${panelID}-group`);
//           return p?.panels?.length;
//         }
//         return true;
//       });


//       let activePanel: string = newPanels[1].panels![newPanels[1].panels!.length -1];
//       if (newPanels.length === 2) {
//         const newID = activePanel = generateUniqueID();
//         newPanels[1].panels = [`${newID}-group`];
//         newPanels.push(
//           {
//             id: `${newID}-group`,
//             direction: Orientation.Vertical,
//             panels: [newID],
//           },
//           {
//             id: newID,
//           },
//         );
//       }
      
//       this.setActivePanel(activePanel);
//       return newPanels;
//     });
//   }

//   static findParent(panelID: string, direction: Orientation) {
//     const key = `${panelID}-${direction}`;
//     return state.panels.panels.find(panel => panel.id.get() === key);
//   }

//   static setTabs(
//     panelID: string,
//     tabs: PanelTab[],
//     setActiveTab: React.Dispatch<React.SetStateAction<string>>,
//     setTabs: React.Dispatch<React.SetStateAction<PanelTab[]>>,
//   ) {
//     this.tabs.set(panelID, {
//       activeTab: tabs[0].id,
//       tabs,
//       setActiveTab,
//       setTabs,
//     });
//     this.setActivePanel(panelID);
//   }

//   static unsetTabs(
//     panelID: string,
//   ) {
//     this.tabs.delete(panelID);
//   }

//   static setActiveTab(panelID: string, tabID: string) {
//     const panelTabs = this.tabs.get(panelID);
//     if (!panelTabs) {
//       return;
//     }

//     panelTabs.activeTab = tabID;
//     panelTabs.setActiveTab(tabID);
//     this.setActivePanel(panelID);
//   }

//   static addTab(panelID: string, tab: PanelTab) {
//     const panelTabs = this.tabs.get(panelID);
//     if (!panelTabs) {
//       return;
//     }

//     const newTabs = [...panelTabs.tabs, tab];
//     panelTabs.activeTab = tab.id;
//     panelTabs.tabs = newTabs;
//     panelTabs.setActiveTab(tab.id);
//     panelTabs.setTabs(newTabs);
//   }

//   static removeTab(panelID: string, tabID: string) {
//     const panelTabs = this.tabs.get(panelID);
//     if (!panelTabs) {
//       return;
//     }

//     const newTabs = panelTabs.tabs.filter(oldTab => oldTab.id !== tabID);
//     if (panelTabs.activeTab === tabID) {
//       const currentTabIndex = panelTabs.tabs.findIndex(oldTab => oldTab.id === tabID);
//       const newActiveIndex = currentTabIndex - 1 < 0 ? 0 : currentTabIndex - 1;
//       const currentTab = newTabs[Number(newActiveIndex)];
//       if (currentTab) {
//         panelTabs.activeTab = currentTab.id;
//         panelTabs.setActiveTab(currentTab.id);
//       }
//     }
//     panelTabs.tabs = newTabs;
//     panelTabs.setTabs(newTabs);

//     this.setActivePanel(panelID);

//     if (newTabs.length === 0) {
//       PanelsManager.removePanel(panelID);
//     }
//   }

//   static changeTab(panelID: string, tabID: string, tab: PanelTab) {
//     const panelTabs = this.tabs.get(panelID);
//     if (!panelTabs) {
//       return;
//     }

//     const newTabs = panelTabs.tabs.map(oldTab => {
//       if (oldTab.id === tabID) {
//         return tab;
//       }
//       return oldTab;
//     });
//     panelTabs.activeTab = tab.id;
//     panelTabs.tabs = newTabs;
//     panelTabs.setActiveTab(tab.id);
//     panelTabs.setTabs(newTabs);

//     this.setActivePanel(panelID);
//   }

//   static addNewTool(panelID: string, toolID: string) {
//     const panelTabs = this.tabs.get(panelID);
//     if (!panelTabs) {
//       return;
//     }

//     const tool = tools.find(t => t.tool === toolID);
//     if (tool) {
//       const newTab = {
//         id: generateUniqueID(),
//         tab: tool.tab(),
//         content: tool.content(),
//         isNewTab: false,
//       }

//       const emptyNewTab = panelTabs.tabs.find(tab => tab.isNewTab);
//       if (emptyNewTab) {
//         this.changeTab(panelID, emptyNewTab.id, newTab);
//       } else {
//         this.addTab(panelID, newTab);
//       }
//     }

//     this.setActivePanel(panelID);
//   }

//   static getTab(panelID: string, tabID: string) {
//     const panelTabs = this.tabs.get(panelID);
//     if (!panelTabs) {
//       return;
//     }
//     return panelTabs.tabs.find(t => t.id === tabID);
//   }

//   static setActivePanel(panelID: string) {
//     if (panelID !== state.panels.activePanel.get()) {
//       state.panels.activePanel.set(panelID);
//     }
//   }

//   static switchTabs(fromPanel: string, toPanel: string, fromTab: string, toTab: string | 0) {
//     // different panels case
//     if (fromPanel !== toPanel) {
//       const tab = this.getTab(fromPanel, fromTab);
//       if (!tab) {
//         return;
//       }

//       // remove tab from panel
//       this.removeTab(fromPanel, fromTab);

//       // add tab to the another panel
//       const panelTabs = this.tabs.get(toPanel);
//       if (!panelTabs) {
//         return;
//       }

//       const newTabs = [...panelTabs.tabs];
//       if (toTab === 0) {
//         newTabs.push(tab);
//       } else {
//         const toIndex = panelTabs.tabs.findIndex(tab => tab.id === toTab);
//         newTabs.splice(toIndex, 0, tab);
//       }
//       panelTabs.tabs = newTabs;
//       panelTabs.setTabs(newTabs);
//       panelTabs.activeTab = tab.id;
//       panelTabs.setActiveTab(tab.id);
//       this.setActivePanel(toPanel);
      
//       return;
//     }

//     // this same tabs in this same panel case
//     if (fromTab === toTab) {
//       return;
//     }
//     const panelTabs = this.tabs.get(fromPanel);
//     if (!panelTabs) {
//       return;
//     }

//     const fromIndex = panelTabs.tabs.findIndex(tab => tab.id === fromTab);
//     const toIndex = panelTabs.tabs.findIndex(tab => tab.id === toTab);

//     const newTabs = [...panelTabs.tabs];
//     // Moves the element in the array for the provided positions.
//     newTabs.splice(toIndex, 0, newTabs.splice(fromIndex, 1)[0]);
//     panelTabs.tabs = newTabs;
//     panelTabs.setTabs(newTabs);
//   }
// }


export class PanelsManager {
  static panels: Map<string, Panel> = new Map();
  private static panelsListeners: Set<(panels?: Panel[], activePanel?: string) => void> = new Set();
  private static tabsListeners: Map<string, (tabs?: PanelTab[], activeTab?: string) => void> = new Map();

  static getPanel(id: PanelID): Panel | undefined {
    return this.panels.get(id);
  }

  static getTab(id: PanelTabID, panelID?: PanelID): PanelTab | undefined {
    if (panelID) {
      const panelTabs = this.getTabs(panelID);
      if (!panelTabs) {
        return;
      }
      return panelTabs.find(tab => tab.id === id);
    }
  }

  static getTabs(panelID: PanelTabID): PanelTab[] | undefined {
    const panel = this.getPanel(panelID);
    if (!panel || !panel.tabs) {
      return;
    }
    return panel.tabs;
  }

  static createPanel(panelID: PanelID, direction: DropDirection): Panel | undefined {
    const panel = this.getPanel(panelID);
    if (!panel) {
      return;
    }
    const parentPanel = this.getPanel(panel.parent as string);
    if (!parentPanel) {
      return;
    }

    if (direction === DropDirection.TOP || direction === DropDirection.BOTTOM) {
      const newPanelID = generateUniqueID();
      const newPanel: Panel = {
        id: newPanelID,
        tabs: [],
        activeTab: '',
        parent: parentPanel.id,
      }
      this.panels.set(newPanelID, newPanel);

      const parentPanels = parentPanel.panels;
      if (!parentPanels) {
        return;
      }
      const index = parentPanels.findIndex(panel => panel === panelID);
      const newPanels = [...parentPanels];
      newPanels.splice(direction === DropDirection.TOP ? index : index + 1, 0, newPanelID);
      parentPanel.panels = newPanels;

      this.updateActivePanel(newPanelID);
      this.updatePanels();
      return newPanel;
    }

    const groupPanel = this.getPanel('group-1');
    if (!groupPanel) {
      return;
    }

    const newPaneGrouplID = generateUniqueID();
    const newPanelID = generateUniqueID();

    const newPanelGroup: Panel = {
      id: newPaneGrouplID,
      direction: Orientation.Vertical,
      panels: [newPanelID],
      parent: groupPanel.id,
    }
    const newPanel: Panel = {
      id: newPanelID,
      tabs: [],
      activeTab: '',
      parent: newPaneGrouplID,
    }

    this.panels.set(newPaneGrouplID, newPanelGroup);
    this.panels.set(newPanelID, newPanel);

    const groupPanels = groupPanel.panels;
    if (!groupPanels) {
      return;
    }
    const index = groupPanels.findIndex(panel => panel === parentPanel.id);
    const newPanels = [...groupPanels];
    newPanels.splice(direction === DropDirection.LEFT ? index : index + 1, 0, newPaneGrouplID);
    groupPanel.panels = newPanels;

    this.updateActivePanel(newPanelID);
    this.updatePanels();
    return newPanel;
  }

  static removePanel(id: PanelID): void {    
    let panelsToRemove: string[] = [id];
    this.findEmptyPanels(id, panelsToRemove);
    if (panelsToRemove.includes('root')) {
      panelsToRemove = panelsToRemove.filter(p => p !== 'root');
      this.restoreDefaultPanels();
    }
    panelsToRemove.forEach(panelID => this.panels.delete(panelID));
    this.updatePanels();
  }

  private static findEmptyPanels(id: PanelID, stack: string[]) {    
    this.panels.forEach(panel => {
      if (panel.panels) {
        panel.panels = panel.panels.filter(p => p !== id);
        if (panel.panels.length === 0 && !stack.includes(panel.id)) {
          stack.push(panel.id);
          this.findEmptyPanels(panel.id, stack);
        }
      }
    });
  }

  // {
  //   id: 'root',
  //   direction: Orientation.Vertical,
  //   panels: ['group-1'],
  // },
  // {
  //   id: 'group-1',
  //   direction: Orientation.Horizontal,
  //   panels: ['panel-1-group', 'panel-2-group'],
  //   parent: 'root',
  // },
  // {
  //   id: 'panel-1-group',
  //   direction: Orientation.Vertical,
  //   panels: ['panel-1'],
  //   parent: 'group-1',
  // },
  // {
  //   id: 'panel-2-group',
  //   direction: Orientation.Vertical,
  //   panels: ['panel-2'],
  //   parent: 'group-1',
  // },
  // {
  //   id: 'panel-1',
  //   tabs: [
  //     {
  //       id: generateUniqueID(),
  //       type: PanelTabType.EMPTY,
  //       tab: <span className="italic">Empty</span>,
  //       content: (
  //         <NewTab />
  //       ),
  //     }
  //   ],
  //   parent: 'panel-1-group',
  // },

  private static restoreDefaultPanels() {
    const groupID = generateUniqueID();
    const panelGroupID = generateUniqueID();
    const panelID = generateUniqueID();

    this.panels.set(groupID, { id: groupID, direction: Orientation.Horizontal, panels: [panelGroupID], parent: 'root' });
    this.panels.set(panelGroupID, { id: panelGroupID, direction: Orientation.Vertical, panels: [panelID], parent: groupID });
    this.panels.set(panelID, { id: panelID, tabs: [this.createEmptyTab()], parent: panelGroupID });
    this.panels.get('root')!.panels = [groupID];
  }

  static createSpecificTab(type: PanelTabType, item?: any): PanelTab | undefined {
    switch (type) {
      case PanelTabType.FILE: return this.createFileTab();
      case PanelTabType.TOOL: return this.createToolTab(item.toolID);
      default: return this.createEmptyTab();
    }
  }

  static createFileTab(): PanelTab | undefined {
    const tool = tools.find(t => t.id === 'editor') as Tool;
    return this.createTab(PanelTabType.FILE, tool.tab, tool.content);
  }

  static createToolTab(id: ToolID): PanelTab | undefined {
    const tool = tools.find(t => t.id === id);
    if (!tool) {
      return;
    }
    return this.createTab(PanelTabType.TOOL, tool.tab(), tool.content());
  }

  static createEmptyTab(): PanelTab {
    return {
      id: generateUniqueID(),
      type: PanelTabType.EMPTY,
      tab: <span className="italic">Empty</span>,
      content: (
        <NewTab />
      ),
    }
  }

  private static createTab(
    type: PanelTabType,
    tab: React.ReactNode,
    content: React.ReactNode,
    metadata?: Record<string, any>,
  ): PanelTab {
    return {
      id: generateUniqueID(),
      type,
      tab,
      content,
      metadata,
    }
  }

  static addTab(tab: PanelTab, panelID: PanelID, position = -1) {
    const tabs = this.getTabs(panelID);
    if (!tabs) {
      return;
    }

    const newTabs = [...tabs];
    if (position === -1) {
      newTabs.push(tab);
    } else {
      position = position > newTabs.length ? newTabs.length : position;
      newTabs.splice(position, 0, tab);
    }
    this.updatePanelTabs(panelID, newTabs, tab.id);
  }

  static addToolTab(toolID: ToolID, panelID: PanelID, position = -1) {
    const toolTab = this.createToolTab(toolID);
    if (!toolTab) {
      return;
    }
    this.addTab(toolTab, panelID, position);
  }

  static removeTab(tabID: PanelTabID, panelID: PanelID) {
    const panel = this.getPanel(panelID);
    const tabs = panel?.tabs
    if (!panel || !tabs) {
      return;
    }

    const newTabs = tabs.filter(oldTab => oldTab.id !== tabID);
    let activeTab = '';
    if (panel.activeTab === tabID) {
      const currentTabIndex = tabs.findIndex(oldTab => oldTab.id === tabID);
      const newActiveIndex = currentTabIndex - 1 < 0 ? 0 : currentTabIndex - 1;
      const currentTab = newTabs[Number(newActiveIndex)];
      if (currentTab) {
        activeTab = currentTab.id;
      }
    }

    if (newTabs.length === 0) {
      this.removePanel(panelID);
      return;
    }
    this.updateActivePanel(panelID);
    this.updatePanelTabs(panelID, newTabs, activeTab);
  }

  static replaceTab(tabID: PanelTabID, tab: PanelTab, panelID: PanelID) {
    const tabs = this.getTabs(panelID);
    if (!tabs) {
      return;
    }

    const newTabs = tabs.map(oldTab => oldTab.id === tabID ? tab : oldTab);
    this.updatePanelTabs(panelID, newTabs, tab.id);
  }

  static switchTabs(fromTab: PanelTabID, fromPanel: PanelID, toTab: PanelTabID | undefined, toPanel: PanelID) {
    // different panels case
    if (fromPanel !== toPanel) {
      const tab = this.getTab(fromTab, fromPanel);
      if (!tab) {
        return;
      }

      // remove tab from panel
      this.removeTab(fromTab, fromPanel);

      // add tab to the another panel
      const panelTabs = this.getTabs(toPanel);
      if (!panelTabs) {
        return;
      }

      const newTabs = [...panelTabs];
      if (toTab === undefined) {
        newTabs.push(tab);
      } else {
        const toIndex = panelTabs.findIndex(tab => tab.id === toTab);
        newTabs.splice(toIndex, 0, tab);
      }

      this.updateActivePanel(toPanel);
      this.updatePanelTabs(toPanel, newTabs, tab.id);
      return;
    }

    // this same tabs in this same panel case
    if (fromTab === toTab) {
      return;
    }
    const panelTabs = this.getTabs(fromPanel);
    if (!panelTabs) {
      return;
    }

    const fromIndex = panelTabs.findIndex(tab => tab.id === fromTab);
    const toIndex = panelTabs.findIndex(tab => tab.id === toTab);

    const newTabs = [...panelTabs];
    // Moves the element in the array for the provided positions.
    newTabs.splice(toIndex, 0, newTabs.splice(fromIndex, 1)[0]);

    this.updatePanelTabs(fromPanel, newTabs, fromTab);
  }

  static addPanelsListener(listener: (panels?: Panel[], activePanel?: PanelID) => void): (panels?: Panel[], activePanel?: PanelID) => void {
    this.panelsListeners.add(listener);
    return listener;
  }

  static removePanelsListener(listener: (panels?: Panel[], activePanel?: PanelID) => void): void {
    this.panelsListeners.delete(listener);
  }

  static addPanelTabsListener(panelID: PanelID, listener: (tabs?: PanelTab[], activeTab?: PanelTabID) => void): void {
    this.tabsListeners.set(panelID, listener);
  }

  static removePanelTabsListener(panelID: PanelID): void {
    this.tabsListeners.delete(panelID);
  }

  static updateActivePanel(panelID: PanelID) {
    if (panelID !== state.panels.activePanel.get()) {
      state.panels.activePanel.set(panelID);
    }
  }

  static updatePanels() {
    const panels = Array.from(this.panels, ([_, panel]) => panel);
    this.panelsListeners.forEach(listener => listener(panels));
  }

  static updateActiveTab(tabID: PanelTabID, panelID: PanelID) {
    this.updatePanelTabs(panelID, undefined, tabID);
    this.updateActivePanel(panelID);
  }

  private static updatePanelTabs(panelID: PanelID, tabs?: PanelTab[], activeTab?: PanelTabID): void {
    const panel = this.getPanel(panelID);
    if (!panel) {
      return;
    }

    panel.tabs = tabs || panel.tabs;
    panel.activeTab = activeTab || panel.activeTab;
    const listener = this.tabsListeners.get(panelID);
    if (listener) {
      listener(tabs, activeTab);
    }
  }
}
