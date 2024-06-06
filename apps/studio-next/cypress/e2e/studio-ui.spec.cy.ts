// import { isV3 } from "../../src/components/Sidebar";
const isV3Test = true;

/* Testing commented hovers is impossible even with `cypress-real-events` so
testing of these hovers is postponed until either Cypress has better support for
`mouseover`/`mouseenter` events or the architecture of `Studio` is changed to
allow testing those. */

describe('Studio UI spec', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Logo should be visible in the UI', () => {
    cy.get('[data-test="logo"]').should('be.visible');
  });

  // it('Logo should display tooltip "AsyncAPI Logo" on hover', () => {
  //   cy.get('[data-test="logo"]').trigger('mouseenter');
  //   cy.contains('AsyncAPI Logo').should('be.visible');
  // });

  it('Button "AsyncAPI Website" should be visible in the UI', () => {
    cy.get('[data-test="button-website"]').should('be.visible');
  });

  // it('Button "AsyncAPI Website" should display tooltip "AsyncAPI Website" on hover', () => {
  //   cy.get('[data-test="button-website"]').trigger('mouseenter');
  //   cy.contains('AsyncAPI Website').should('be.visible');
  // });

  it('Button "AsyncAPI Github Organization" should be visible in the UI', () => {
    cy.get('[data-test="button-github"]').should('be.visible');
  });

  // it('Button "AsyncAPI Github Organization" should display tooltip "AsyncAPI Github Organization" on hover', () => {
  //   cy.get('[data-test="button-github"]').trigger('mouseenter');
  //   cy.contains('AsyncAPI Github Organization').should('be.visible');
  // });

  it('Button "AsyncAPI Slack Workspace" should be visible in the UI', () => {
    cy.get('[data-test="button-slack"]').should('be.visible');
  });

  // it('Button "AsyncAPI Slack Workspace" should display tooltip "AsyncAPI Slack Workspace" on hover', () => {
  //   cy.get('[data-test="button-slack"]').trigger('mouseenter');
  //   cy.contains('AsyncAPI Slack Workspace').should('be.visible');
  // });

  it('Button "Navigation" should be visible in the UI', () => {
    cy.get('[data-test="button-navigation"]').should('be.visible');
  });

  it('Button "Navigation" should display tooltip "Navigation" on hover', () => {
    cy.get('[data-test="button-navigation"]').trigger('mouseenter');
    cy.contains('Navigation').should('be.visible');
  });

  it('Button "Editor" should be visible in the UI', () => {
    cy.get('[data-test="button-editor"]').should('be.visible');
  });

  it('Button "Editor" should display tooltip "Editor" on hover', () => {
    cy.get('[data-test="button-editor"]').trigger('mouseenter');
    cy.contains('Editor').should('be.visible');
  });

  it('Button "Template preview" should be visible in the UI', () => {
    cy.get('[data-test="button-template-preview"]').should('be.visible');
  });

  it('Button "Template preview" should display tooltip "Template preview" on hover', () => {
    cy.get('[data-test="button-template-preview"]').trigger('mouseenter');
    cy.contains('Template preview').should('be.visible');
  });

  if (!isV3Test) { // review the need of v2 testing in general
    it('Button "Blocks visualiser" should be visible in the UI', () => {
      cy.get('[data-test="button-blocks-visualiser"]').should('be.visible');
    });

    it('Button "Blocks visualiser" should display tooltip "Blocks visualiser" on hover', () => {
      cy.get('[data-test="button-blocks-visualiser"]').trigger('mouseenter');
      cy.contains('Blocks visualiser').should('be.visible');
    });
  }

  it('Button "New file" should be visible in the UI', () => {
    cy.get('[data-test="button-new-file"]').should('be.visible');
  });

  it('Button "New file" should display tooltip "New file" on hover', () => {
    cy.get('[data-test="button-new-file"]').trigger('mouseenter');
    cy.contains('New file').should('be.visible');
  });

  it('Button "Settings" should be visible in the UI', () => {
    cy.get('[data-test="button-settings"]').should('be.visible');
  });

  it('Button "Settings" should display tooltip "Studio settings" on hover', () => {
    cy.get('[data-test="button-settings"]').trigger('mouseenter');
    cy.contains('Studio settings').should('be.visible');
  });

  it('Button "Share" should be visible in the UI', () => {
    cy.get('[data-test="button-share"]').should('be.visible');
  });

  it('Button "Share" should display tooltip "Share link" on hover', () => {
    cy.get('[data-test="button-share"]').trigger('mouseenter');
    cy.contains('Share link').should('be.visible');
  });

  it('Button "Dropdown" should be visible in the UI', () => {
    cy.get('[data-test="button-dropdown"]').should('be.visible');
  });

  it('Dropdown menu should contain 8 elements with predefined text', () => {
    cy.get('[data-test="button-dropdown"]').click();
    cy.contains('Import from URL');
    cy.contains('Import File');
    cy.contains('Import from Base64');
    cy.contains('Generate code/docs');
    cy.contains('Save as YAML');
    cy.contains('Convert and save as JSON');
    cy.contains('Convert to JSON');
    cy.contains('Convert document');
  });
  
  it('Click on Dropdown menu\'s element "Generate code/docs" should open Modal window "Generate code/docs based on your AsyncAPI Document"', () => {
    cy.get('[data-test="button-dropdown"]').click();
    cy.contains('Generate code/docs').click();
    cy.contains('Generate code/docs based on your AsyncAPI Document');
  });
});
