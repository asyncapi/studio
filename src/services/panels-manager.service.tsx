import { HTMLWrapper, MonacoWrapper } from '../components';

import { PanelItem } from '../components/Panels/Panels';
import { PanelTab } from '../components/Panels/PanelsTabs';
import { Terminal } from '../components/Terminal';
import { Visualiser } from '../components/Visualiser';
import { generateUniqueID } from '../helpers';

import state from '../state';

const tools = [
  {
    title: 'Editor',
    description: () => <>A Editor</>,
    tool: 'editor',
    tab: () => (
      <span>Editor</span>
    ),
    content: () => <MonacoWrapper />
  },
  {
    title: 'HTML Template',
    description: () => <>A HTML template</>,
    tool: 'html',
    tab: () => (
      <span>HTML</span>
    ),
    content: () => <HTMLWrapper />
  },
  {
    title: 'Visualiser',
    description: () => <>A Visualiser</>,
    tool: 'visualiser',
    tab: () => (
      <span>Visualiser</span>
    ),
    content: () => <Visualiser />
  },
  {
    title: 'Terminal',
    description: () => <>A Terminal</>,
    tool: 'terminal',
    tab: () => (
      <span>Terminal</span>
    ),
    content: () => <Terminal />
  },
];

export class PanelsManager {
  static tabs: Map<string, {
    activeTab: string,
    tabs: PanelTab[],
    setActiveTab: React.Dispatch<React.SetStateAction<string>>,
    setTabs: React.Dispatch<React.SetStateAction<PanelTab[]>>,
  }> = new Map();

  static addPanel(panelID: string, direction: PanelItem['direction'], scope: 'nearest' | 'upper'): void {
    const nearestParent = this.findParent(panelID, direction);
    if (!nearestParent) {
      return;
    }
    
    const newPanel = generateUniqueID();
    state.panels.panels.merge([
      {
        id: `${newPanel}-vertical`,
        direction: 'vertical',
        panels: [`${newPanel}-horizontal`],
        parent: nearestParent.parent.get(),
      },
      {
        id: `${newPanel}-horizontal`,
        direction: 'horizontal',
        panels: [newPanel],
        parent: nearestParent.parent.get(),
      },
      {
        id: newPanel,
        parent: newPanel,
      },
    ]);

    if (scope === 'nearest') {
      nearestParent.panels.merge([newPanel]);
    } else {
      const upperParent = this.findParent(nearestParent.id.get() as string, direction);
      if (!upperParent) {
        return;
      }
      upperParent.panels.merge([newPanel]);
    }
    // parentPanel?.panels.merge([newPanel]);

    // // state.panels.panels.merge()

    // {
    //   id: 'panel-1-vertical',
    //   direction: 'vertical',
    //   panels: ['panel-1-horizontal'],
    //   parent: 'root',
    // },
    // {
    //   id: 'panel-1-horizontal',
    //   direction: 'horizontal',
    //   panels: ['panel-1'],
    //   parent: 'root',
    // },
    // {
    //   id: 'panel-1',
    //   parent: 'panel-1',
    // },
  }

  static removePanel(panelID: string) {
    state.panels.panels.set(oldPanels => {
      const newPanels = oldPanels
        .filter(panel => panel.id && !panel.id.startsWith(panelID))
        .map(panel => {
          if (panel.panels) {
            return {
              ...panel,
              panels: panel.panels.filter(p => !p.startsWith(panelID)),
            };
          }
          return { ...panel };
        });

      if (newPanels.length === 2) {
        newPanels[0].panels = ['root-horizontal'],
        newPanels[1].panels = ['panel-1-vertical'],
        newPanels.push(
          {
            id: 'panel-1-vertical',
            direction: 'vertical',
            panels: ['panel-1-horizontal'],
            parent: 'root',
          },
          {
            id: 'panel-1-horizontal',
            direction: 'horizontal',
            panels: ['panel-1'],
            parent: 'root',
          },
          {
            id: 'panel-1',
            parent: 'panel-1',
          },
        );
      }

      return newPanels;
    });
    // console.log(state.panels.panels.get())
  }

  static findParent(panelID: string, direction: PanelItem['direction']) {
    const currentPanel = state.panels.panels.find(panel => panel.id.get() === panelID);
    const searchedID = `${currentPanel?.parent.get()}-${direction}`;
    return state.panels.panels.find(panel => panel.id.get() === searchedID);
  }

  static setTabs(
    panelID: string,
    tabs: PanelTab[],
    setActiveTab: React.Dispatch<React.SetStateAction<string>>,
    setTabs: React.Dispatch<React.SetStateAction<PanelTab[]>>,
  ) {
    this.tabs.set(panelID, {
      activeTab: tabs[0].name,
      tabs,
      setActiveTab,
      setTabs,
    });
    this.setActivePanel(panelID);
  }

  static unsetTabs(
    panelID: string,
  ) {
    this.tabs.delete(panelID);
  }

  static setActiveTab(panelID: string, tabID: string) {
    const panelTabs = this.tabs.get(panelID);
    if (!panelTabs) {
      return;
    }

    panelTabs.activeTab = tabID;
    panelTabs.setActiveTab(tabID);
    this.setActivePanel(panelID);
  }

  static addTab(panelID: string, tab: PanelTab) {
    const panelTabs = this.tabs.get(panelID);
    if (!panelTabs) {
      return;
    }

    const newTabs = [...panelTabs.tabs, tab];
    panelTabs.activeTab = tab.name;
    panelTabs.tabs = newTabs;
    panelTabs.setActiveTab(tab.name);
    panelTabs.setTabs(newTabs);
  }

  static removeTab(panelID: string, tabID: string) {
    const panelTabs = this.tabs.get(panelID);
    if (!panelTabs) {
      return;
    }

    const newTabs = panelTabs.tabs.filter(oldTab => oldTab.name !== tabID);
    if (panelTabs.activeTab === tabID) {
      const currentTabIndex = panelTabs.tabs.findIndex(oldTab => oldTab.name === tabID);
      const newActiveIndex = currentTabIndex - 1 < 0 ? 0 : currentTabIndex - 1;
      const currentTab = newTabs[Number(newActiveIndex)];
      console.log(currentTab)
      if (currentTab) {
        panelTabs.activeTab = currentTab.name;
        panelTabs.setActiveTab(currentTab.name);
      }
    }
    panelTabs.tabs = newTabs;
    panelTabs.setTabs(newTabs);

    this.setActivePanel(panelID);

    if (newTabs.length === 0) {
      PanelsManager.removePanel(panelID);
    }
  }

  static changeTab(panelID: string, tabID: string, tab: PanelTab) {
    const panelTabs = this.tabs.get(panelID);
    if (!panelTabs) {
      return;
    }

    const newTabs = panelTabs.tabs.map(oldTab => {
      if (oldTab.name === tabID) {
        return tab;
      }
      return oldTab;
    });
    panelTabs.activeTab = tab.name;
    panelTabs.tabs = newTabs;
    panelTabs.setActiveTab(tab.name);
    panelTabs.setTabs(newTabs);

    this.setActivePanel(panelID);
  }

  static addNewTool(panelID: string, toolID: string) {
    const panelTabs = this.tabs.get(panelID);
    if (!panelTabs) {
      return;
    }

    const tool = tools.find(t => t.tool === toolID);
    if (tool) {
      const newTab = {
        name: generateUniqueID(),
        tab: tool.tab(),
        content: tool.content(),
        isNewTab: false,
      }

      const emptyNewTab = panelTabs.tabs.find(tab => tab.isNewTab);
      if (emptyNewTab) {
        this.changeTab(panelID, emptyNewTab.name, newTab);
      } else {
        this.addTab(panelID, newTab);
      }
    }

    this.setActivePanel(panelID);
  }

  static setActivePanel(panelID: string) {
    if (panelID !== state.panels.activePanel.get()) {
      state.panels.activePanel.set(panelID);
    }
  }

  static switchTabs(panelID: string, from: string, to: string) {
    if (from === to) {
      return;
    }
    const panelTabs = this.tabs.get(panelID);
    if (!panelTabs) {
      return;
    }

    const fromIndex = panelTabs.tabs.findIndex(tab => tab.name === from);
    const toIndex = panelTabs.tabs.find(tab => tab.name === to);
    console.log(fromIndex, from);
    console.log(toIndex, to);
    if (fromIndex >= panelTabs.tabs.length) {
      let k = fromIndex - panelTabs.tabs.length + 1;
      while (k--) {
        panelTabs.tabs.push(undefined as any);
      }
    }

    // const toPanel = panelTabs.tabs.find(tab => tab.name === to);
    // const newTabs = panelTabs.tabs.reduce((acc, tab) => {
    //   if (tab.name) {

    //   }
    // }, [] as PanelTab[]);

    // const newTabs = [...panelTabs.tabs];
    // newTabs.splice(fromIndex, 0, newTabs.splice(toIndex, 1)[0]);
    // console.log(panelTabs.tabs);
    // console.log(newTabs);
    // panelTabs.tabs = newTabs;
    // panelTabs.setTabs(newTabs);
  }
}
