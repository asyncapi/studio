import { PanelItem } from "../components/Panels/Panels";
import { generateUniqueID } from "../helpers";

import state from '../state';

export class PanelsManager {
  static addPanel(panelID: string, direction: PanelItem['direction']): void {
    const currentParent = this.findParent(panelID, direction);
    if (!currentParent) {
      return;
    }

    const upperParent = this.findParent(currentParent.id.get() as string, direction);
    if (!upperParent) {
      return;
    }
    console.log(upperParent.id.get())
    console.log(currentParent.parent.get())
    
    const newPanel = generateUniqueID();
    state.panels.panels.merge([
      {
        id: `${newPanel}-vertical`,
        direction: 'vertical',
        panels: [`${newPanel}-horizontal`],
        parent: currentParent.parent.get(),
      },
      {
        id: `${newPanel}-horizontal`,
        direction: 'horizontal',
        panels: [newPanel],
        parent: currentParent.parent.get(),
      },
      {
        id: newPanel,
        parent: newPanel,
      },
    ]);
    upperParent.panels.merge([newPanel]);
    // // parentPanel?.panels.merge([newPanel]);

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

  }

  static findParent(panelID: string, direction: PanelItem['direction']) {
    const currentPanel = state.panels.panels.find(panel => panel.id.get() === panelID);
    const searchedID = `${currentPanel?.parent.get()}-${direction}`;
    return state.panels.panels.find(panel => panel.id.get() === searchedID);
  }
}
