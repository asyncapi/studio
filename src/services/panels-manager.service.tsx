import React from 'react';
import { Tool, ToolID, ToolsManager } from './tools-manager.service';

import { EmptyTab } from '../components/Panels/Tabs';
import { Orientation } from '../components/Split/sash';

import { generateUniqueID } from '../helpers';

import state from '../state';

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
  visible?: boolean;
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
}
export interface PanelTab<M extends Record<string, any> = Record<string, any>> {
  id: PanelTabID;
  type: PanelTabType,
  tab: React.ReactNode;
  content: React.ReactNode;
  metadata?: M;
}

export class PanelsManager {
  private static startupPanels: Panel[] = [
    {
      id: 'root',
      direction: Orientation.Vertical,
      panels: ['group-1'],
    },
    {
      id: 'group-1',
      direction: Orientation.Horizontal,
      panels: ['panel-1-group', 'panel-2-group'],
      parent: 'root',
    },
    {
      id: 'panel-1-group',
      direction: Orientation.Vertical,
      panels: ['panel-1'],
      parent: 'group-1',
    },
    {
      id: 'panel-2-group',
      direction: Orientation.Vertical,
      panels: ['panel-2'],
      parent: 'group-1',
    },
    {
      id: 'panel-1',
      tabs: [PanelsManager.createFileTab()],
      parent: 'panel-1-group',
    },
    {
      id: 'panel-2',
      tabs: [PanelsManager.createToolTab('html')!],
      parent: 'panel-2-group',
    },
  ];

  static panels: Map<string, Panel> = new Map(PanelsManager.startupPanels.map(panel => [panel.id, panel]));
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
      };
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

    const groupPanel = this.getPanel(parentPanel.parent as string);
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
    };
    const newPanel: Panel = {
      id: newPanelID,
      tabs: [],
      activeTab: '',
      parent: newPaneGrouplID,
    };

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
    const panelsToRemove: string[] = [id];
    this.findEmptyPanels(id, panelsToRemove);
    if (panelsToRemove.includes('root')) {
      this.restoreDefaultPanels();
      return;
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

  static updatePanelVisibility(visible = true, panelID: PanelID): void {
    const panel = this.getPanel(panelID);
    if (!panel) {
      return;
    }
    const parent = this.getPanel(panel.parent as string);
    if (!parent) {
      return;
    }

    visible = visible !== false;
    panel.visible = visible;
    if (visible) {
      if (parent.visible === false) {
        parent.visible = visible;
      }
    } else {
      let hidden = 0;
      const parentPanels = parent.panels || [];
      for (const p of parentPanels) {
        if (p !== panelID) {
          const childPanel = this.getPanel(p as string);
          hidden = childPanel && childPanel.visible === false ? hidden + 1 : hidden;
        }
      }
      if (hidden === parentPanels.length - 1) {
        parent.visible = false;
      }
    }

    this.updatePanels();
  }

  static restoreDefaultPanels() {
    const groupID = generateUniqueID();
    const panelGroupID = generateUniqueID();
    const panelID = generateUniqueID();
    const emptyTab = this.createEmptyTab();

    this.panels = new Map();
    this.panels.set('root', { id: 'root', direction: Orientation.Vertical, panels: [groupID] });
    this.panels.set(groupID, { id: groupID, direction: Orientation.Horizontal, panels: [panelGroupID], parent: 'root' });
    this.panels.set(panelGroupID, { id: panelGroupID, direction: Orientation.Vertical, panels: [panelID], parent: groupID });
    this.panels.set(panelID, { id: panelID, tabs: [emptyTab], activeTab: emptyTab.id, parent: panelGroupID });
    this.updateActivePanel(panelID);
    this.updatePanels();
  }

  static createSpecificTab(type: PanelTabType, item?: any): PanelTab | undefined {
    switch (type) {
    case PanelTabType.FILE: return this.createFileTab();
    case PanelTabType.TOOL: return this.createToolTab(item.toolID);
    default: return this.createEmptyTab();
    }
  }

  static movePanel(from: PanelID, to: PanelID, direction: DropDirection): void {
    if (from === to) {
      return;
    }

    const fromPanel = this.getPanel(from);
    if (!fromPanel || !fromPanel.parent) {
      return;
    }
    const parentPanel = this.getPanel(fromPanel.parent);
    if (!parentPanel) {
      return;
    }

    if (direction === DropDirection.TOP || direction === DropDirection.BOTTOM) {
      const parentPanels = parentPanel.panels;
      if (!parentPanels) {
        return;
      }

      const fromIndex = parentPanels.findIndex(panel => panel === from);
      const toIndex = parentPanels.findIndex(panel => panel === to);
      const newPanels = [...parentPanels];
      // Moves the element in the array for the provided positions.
      newPanels.splice(toIndex, 0, newPanels.splice(fromIndex, 1)[0]);
      parentPanel.panels = newPanels;

      this.updateActivePanel(from);
      this.updatePanels();
    }
  }

  static mergePanels(from: PanelID, to: PanelID): void {
    if (from === to) {
      return;
    }

    const fromPanel = this.getPanel(from);
    if (!fromPanel) {
      return;
    }
    const fromTabs = fromPanel.tabs;
    if (!fromTabs) {
      return;
    }

    fromTabs.forEach(tab => this.addTab(tab, to));
    this.removePanel(from);
  }

  static createFileTab(): PanelTab {
    const tool = ToolsManager.getTool('editor') as Tool;
    return this.createTab(PanelTabType.FILE, tool.tab(), tool.content());
  }

  static createToolTab(id: ToolID): PanelTab | undefined {
    const tool = ToolsManager.getTool(id);
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
        <EmptyTab />
      ),
    };
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
    };
  }

  static addTab(tab: PanelTab, panelID: PanelID, position: number | PanelTabID = -1) {
    const tabs = this.getTabs(panelID);
    if (!tabs) {
      return;
    }

    const newTabs = [...tabs];
    if (typeof position === 'string') {
      position = tabs.findIndex(tab => tab.id === position);
      position = position === undefined ? -1 : position;
    }
    if (position === -1) {
      newTabs.push(tab);
    } else {
      position = position > newTabs.length ? newTabs.length : position;
      newTabs.splice(position, 0, tab);
    }
    this.updateActivePanel(panelID);
    this.updatePanelTabs(panelID, newTabs, tab.id);
  }

  static addToolTab(toolID: ToolID, panelID: PanelID, position: number | PanelTabID = -1) {
    const toolTab = this.createToolTab(toolID);
    if (!toolTab) {
      return;
    }
    this.addTab(toolTab, panelID, position);
  }

  static removeTab(tabID: PanelTabID, panelID: PanelID) {
    const panel = this.getPanel(panelID);
    const tabs = panel?.tabs;
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
    this.updatePanels();
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
    this.updatePanels();
  }
}
