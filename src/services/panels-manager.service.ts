import { PanelItem } from "../components/Panels/Panels";
import { generateUniqueID } from "../helpers";

import state from '../state';

export class PanelsManager {
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
        .filter(panel => !panel.id!.startsWith(panelID))
        .map(panel => {
          if (panel.panels) {
            return {
              ...panel,
              panels: panel.panels.filter(p => !p.startsWith(panelID)),
            }
          }
          return { ...panel }
        });
      return newPanels;
    });
    // console.log(state.panels.panels.get())
  }

  static findParent(panelID: string, direction: PanelItem['direction']) {
    const currentPanel = state.panels.panels.find(panel => panel.id.get() === panelID);
    const searchedID = `${currentPanel?.parent.get()}-${direction}`;
    return state.panels.panels.find(panel => panel.id.get() === searchedID);
  }
}
