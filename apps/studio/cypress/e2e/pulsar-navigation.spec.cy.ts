type PulsarDocumentOptions = {
  namespace?: string;
  tenants?: string[];
};

function createPulsarDocument({
  namespace = 'billing',
  tenants = ['acme'],
}: PulsarDocumentOptions = {}) {
  const namespaceBinding = namespace ? `\n      namespace: ${namespace}` : '';
  const servers = tenants.map((tenant, index) => `  broker-${index + 1}:
    host: pulsar-${index + 1}.example.com
    protocol: pulsar
    bindings:
      pulsar:
        tenant: ${tenant}`).join('\n');

  return `asyncapi: 3.1.0
info:
  title: Pulsar navigation test
  version: 1.0.0
servers:
${servers}
channels:
  orders:
    address: orders.created
    bindings:
      pulsar:
        persistence: persistent${namespaceBinding}
operations:
  receiveOrders:
    action: receive
    channel:
      $ref: '#/channels/orders'
  sendOrders:
    action: send
    channel:
      $ref: '#/channels/orders'
`;
}

function visitDocument(document: string) {
  const base64 = Cypress.Buffer.from(document).toString('base64');

  cy.visit(`/?base64=${encodeURIComponent(base64)}`, {
    onBeforeLoad(win) {
      win.localStorage.clear();
    },
  });
}

describe('Pulsar channel navigation', () => {
  it('uses the formatted Pulsar channel name in AsyncAPI 3.1 navigation', () => {
    visitDocument(createPulsarDocument());

    cy.get('#navigation-panel').should('contain.text', 'persistent://acme/billing/orders.created');
    cy.get('#navigation-panel').should('contain.text', 'Receive');
    cy.get('#navigation-panel').should('contain.text', 'Send');
  });

  it('falls back to the channel address when the Pulsar namespace is missing', () => {
    visitDocument(createPulsarDocument({ namespace: '' }));

    cy.get('#navigation-panel').should('contain.text', 'orders.created');
    cy.get('#navigation-panel').should('not.contain.text', 'persistent://');
  });

  it('falls back to the channel address when multiple Pulsar tenants are configured', () => {
    visitDocument(createPulsarDocument({ tenants: ['acme', 'globex'] }));

    cy.get('#navigation-panel').should('contain.text', 'orders.created');
    cy.get('#navigation-panel').should('not.contain.text', 'persistent://');
  });
});
