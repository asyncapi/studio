type PaneBounds = {
  left: number;
  right: number;
  width: number;
};

type SplitPaneBounds = {
  width: number;
  scrollWidth: number;
  panes: PaneBounds[];
};

function captureVerticalSplitPanes(win: Window): SplitPaneBounds[] {
  return Array.from(win.document.querySelectorAll<HTMLElement>('.SplitPane.vertical')).map(splitPane => {
    const splitPaneBounds = splitPane.getBoundingClientRect();
    const panes = Array.from(splitPane.children)
      .filter((child): child is HTMLElement => child instanceof HTMLElement && child.classList.contains('Pane'))
      .map(pane => {
        const bounds = pane.getBoundingClientRect();

        return {
          left: Math.round(bounds.left - splitPaneBounds.left),
          right: Math.round(bounds.right - splitPaneBounds.left),
          width: Math.round(bounds.width),
        };
      });

    return {
      width: Math.round(splitPaneBounds.width),
      scrollWidth: splitPane.scrollWidth,
      panes,
    };
  });
}

function assertStableLayout(expectedVisiblePanes: boolean[][]) {
  cy.window().then(win => new Cypress.Promise<SplitPaneBounds[][]>(resolve => {
    win.requestAnimationFrame(() => {
      const firstFrame = captureVerticalSplitPanes(win);

      win.requestAnimationFrame(() => {
        resolve([firstFrame, captureVerticalSplitPanes(win)]);
      });
    });
  })).then(([firstFrame, secondFrame]) => {
    expect(secondFrame).to.deep.equal(firstFrame);
    expect(secondFrame).to.have.length(expectedVisiblePanes.length);

    secondFrame.forEach((splitPane, splitPaneIndex) => {
      expect(splitPane.width).to.be.greaterThan(0);
      expect(splitPane.scrollWidth).to.be.at.most(splitPane.width + 1);

      splitPane.panes.forEach((pane, paneIndex) => {
        expect(pane.left).to.be.at.least(-1);
        expect(pane.right).to.be.at.most(splitPane.width + 1);

        if (expectedVisiblePanes[splitPaneIndex][paneIndex]) {
          expect(pane.width).to.be.greaterThan(0);
        } else {
          expect(pane.width).to.equal(0);
        }
      });
    });
  });
}

describe('Panel layout transitions', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.removeItem('studio-panels');
      },
    });
  });

  it('opens the editor without a transient layout when navigation is visible', () => {
    cy.get('[data-test="button-editor"]').click();
    cy.get('[data-test="button-editor"]').click();

    assertStableLayout([
      [true, true],
      [true, true],
    ]);
  });

  it('opens navigation from preview-only view without pane overflow or jumps', () => {
    cy.get('[data-test="button-navigation"]').click();
    cy.get('[data-test="button-editor"]').click();
    cy.get('[data-test="button-navigation"]').click();

    assertStableLayout([
      [true, true],
      [true, false],
    ]);
  });

  it('opens the editor from preview-only view without a transient layout', () => {
    cy.get('[data-test="button-navigation"]').click();
    cy.get('[data-test="button-editor"]').click();
    cy.get('[data-test="button-editor"]').click();

    assertStableLayout([
      [true, true],
      [false, true],
    ]);
  });
});
