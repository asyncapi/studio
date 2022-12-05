import { AbstractService } from './abstract.service';

import { panelsState } from '../state';

import type { Panel, PanelsState, PanelTab } from '../state/panels.state';
import type { File } from '../state/files.state';

export class PanelsService extends AbstractService {
  override onInit() {
    this.subscribeToFiles();
  }

  openTab(panelId: string, tabId: string, tab: PanelTab) {
    if (this.getPanel(panelId)?.activeTab === tabId) {
      return;
    }

    if (this.hasTab(panelId, tabId)) {
      return this.setActiveTab(panelId, tabId);
    }

    this.addTab(panelId, tabId, tab);
    this.setActiveTab(panelId, tabId);
  }

  openEditorTab(panelId: string, file: File) {
    return this.openTab(panelId, file.uri, { id: file.uri, type: 'editor', uri: file.uri, panel: panelId });
  }

  addTab(panelId: string, tabId: string, tab: Partial<PanelTab>): void {
    if (this.hasTab(panelId, tabId)) {
      return this.updateTab(panelId, tabId, tab);
    }
  
    let panel = this.getPanel(panelId)!;
    panel = { ...panel };
    // TODO: Handle that casting to normal PanelTab in argument
    panel.tabs = [...panel.tabs, tab as PanelTab];

    this.svcs.eventsSvc.emit('panels.tab.add', tab as PanelTab);
    this.updatePanelState(panelId, panel);
  }

  updateTab(panelId: string, tabId: string, tab: Partial<PanelTab>): void {
    if (!this.hasTab(panelId, tabId)) {
      return this.addTab(panelId, tabId, tab);
    }
  
    let panel = this.getPanel(panelId)!;
    panel = { ...panel };
    panel.tabs = panel.tabs.map(t => t.id === tabId ? (tab = { ...t, ...tab }) : t);

    this.svcs.eventsSvc.emit('panels.tab.update', tab as PanelTab);
    this.updatePanelState(panelId, panel);
  }

  removeTab(panelId: string, tabId: string): void {
    const tab = this.getTab(panelId, tabId);
    if (!tab) {
      return;
    }
  
    let panel = this.getPanel(panelId);
    if (!panel) {
      return;
    }
  
    panel = { ...panel };
    let activeTab = panel.activeTab;
    if (activeTab === tabId) {
      const indexOf = panel.tabs.findIndex(t => t.id === tabId);
      if (indexOf === 0) { // set active second tab (if exist)
        const secondTab = panel.tabs[1];
        activeTab = panel.activeTab = secondTab ? secondTab.id : '';
      } else { // otherwise set active previous tab 
        activeTab = panel.activeTab = panel.tabs[indexOf - 1].id;
      }
    }
  
    panel.tabs = panel.tabs.filter(t => t.id !== tabId);
    this.svcs.eventsSvc.emit('panels.tab.remove', tab);
    this.svcs.eventsSvc.emit('panels.panel.set-active-tab', panel);
    this.updatePanelState(panelId, panel);
  }

  setActiveTab(panelId: string, tabId: string) {
    if (!this.hasTab(panelId, tabId)) {
      return;
    }

    const panel = this.getPanel(panelId);
    if (panel) {
      const newPanel = { ...panel, activeTab: tabId };
      this.svcs.eventsSvc.emit('panels.panel.set-active-tab', newPanel);
      this.updatePanelState(panelId, newPanel);
    }
  }

  getPanel(panelId: string): Panel | undefined {
    const state = panelsState.getState();
    return state.panels[String(panelId)];
  }

  hasPanel(panelId: string): boolean {
    return Boolean(this.getPanel(panelId));
  }

  getTab(panelId: string, tabId: string) {
    const panelState = this.getPanel(panelId);
    if (panelState) {
      return panelState.tabs.find(t => t.id === tabId);
    }
  }

  getActiveTab(panelId: string) {
    const panel = this.getPanel(panelId);
    if (panel) {
      return panel.tabs.find(t => t.id === panel.activeTab);
    }
  }
  
  hasTab(panelId: string, tabId: string): boolean {
    return Boolean(this.getTab(panelId, tabId));
  }

  getState(): PanelsState {
    return panelsState.getState();
  }

  setState(state: Partial<PanelsState>) {
    panelsState.setState(state);
  }

  private updatePanelState(panelId: string, panel: Partial<Panel>) {
    const panelState = this.getPanel(panelId);
    if (panelState) {
      const newPanelState = { ...panelState, ...panel };
      panelsState.setState(state => ({
        panels: {
          ...state.panels,
          [String(panelId)]: newPanelState,
        }
      }));
      this.svcs.eventsSvc.emit('panels.panel.update', newPanelState);
    }
  }

  private subscribeToFiles() {
    this.svcs.eventsSvc.on('fs.file.remove', file => {
      console.log(file);
      const panel = this.getPanel('primary');
      if (!panel) {
        return;
      }

      const tab = panel.tabs.find(t => t.type === 'editor' && t.uri === file.uri);
      if (tab) {
        this.removeTab(tab.panel, tab?.id);
      }
    });
  }
}
