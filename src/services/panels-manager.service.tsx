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

  static addPanel(panelID: string, direction: PanelItem['direction']): void {
    const parent = state.panels.panels.find(panel => {
      const panels = panel.panels.get();
      if (panels?.includes(panelID)) return true;
      return false;
    });
    if (!parent) {
      return;
    }
    
    const newPanel = generateUniqueID();
    state.panels.panels.merge([
      {
        id: newPanel,
      },
    ]);
    parent.set(oldParent => {
      const panels = oldParent.panels!;
      const index = panels.findIndex(panel => panel === panelID);
      const newPanels = [...panels];
      newPanels.splice(index + 1, 0, newPanel);
      oldParent.panels = newPanels;
      return oldParent;
    });
    state.panels.activePanel.set(newPanel);
  }

  static removePanel(panelID: string) {
    state.panels.panels.set(oldPanels => {
      const newPanels = oldPanels
        .filter(panel => panel.id !== panelID)
        .map(panel => {
          if (panel.panels) {
            return {
              ...panel,
              panels: panel.panels.filter(p => p !== panelID),
            };
          }
          return { ...panel };
        });

      if (newPanels.length === 2) {
        const newID = generateUniqueID();
        newPanels[1].panels = [newID];
        newPanels.push(
          {
            id: newID,
          },
        );
      }
      return newPanels;
    });
  }

  static findParent(panelID: string, direction: PanelItem['direction']) {
    const key = `${panelID}-${direction}`;
    return state.panels.panels.find(panel => panel.id.get() === key);
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

  static getTab(panelID: string, tabID: string) {
    const panelTabs = this.tabs.get(panelID);
    if (!panelTabs) {
      return;
    }
    return panelTabs.tabs.find(t => t.name === tabID);
  }

  static setActivePanel(panelID: string) {
    if (panelID !== state.panels.activePanel.get()) {
      state.panels.activePanel.set(panelID);
    }
  }

  static switchTabs(fromPanel: string, toPanel: string, fromTab: string, toTab: string | 0) {
    // different panels case
    if (fromPanel !== toPanel) {
      const tab = this.getTab(fromPanel, fromTab);
      if (!tab) {
        return;
      }

      // remove tab from panel
      this.removeTab(fromPanel, fromTab);

      // add tab to the another panel
      const panelTabs = this.tabs.get(toPanel);
      if (!panelTabs) {
        return;
      }

      const newTabs = [...panelTabs.tabs];
      if (toTab === 0) {
        newTabs.push(tab);
      } else {
        const toIndex = panelTabs.tabs.findIndex(tab => tab.name === toTab);
        newTabs.splice(toIndex, 0, tab);
      }
      panelTabs.tabs = newTabs;
      panelTabs.setTabs(newTabs);
      panelTabs.activeTab = tab.name;
      panelTabs.setActiveTab(tab.name);
      this.setActivePanel(toPanel);
      
      return;
    }

    // this same tabs in this same panel case
    if (fromTab === toTab) {
      return;
    }
    const panelTabs = this.tabs.get(fromPanel);
    if (!panelTabs) {
      return;
    }

    const fromIndex = panelTabs.tabs.findIndex(tab => tab.name === fromTab);
    const toIndex = panelTabs.tabs.findIndex(tab => tab.name === toTab);

    const newTabs = [...panelTabs.tabs];
    // Moves the element in the array for the provided positions.
    newTabs.splice(toIndex, 0, newTabs.splice(fromIndex, 1)[0]);
    panelTabs.tabs = newTabs;
    panelTabs.setTabs(newTabs);
  }
}
