const { When, Then, And } = require('cypress-cucumber-preprocessor/steps');

const schemaJson = '[{"product":"Laptop","inStock":true},{"product":"Mouse"}]';

When(/^I open json tool with a json array$/, function () {
  cy.visit('/');
  cy.withInputEditor().writeAndWait(schemaJson);
});

When(/^I open json tool with nested json$/, function () {
  cy.visit('/');
  cy.withInputEditor().writeAndWait('{"slideshows":[{"title":"a"},{"title":"b"}],"author":{"name":"x"}}');
});

And(/^I go to the shape$/, function () {
  cy.goToSchema().click();
});

Then(/^I see the json shape with property percentages$/, function () {
  cy.get('[data-testid="json-shape"]').should('be.visible');
  cy.get('[data-testid="json-shape-objects-value"]').should('have.text', '2');
  cy.get('[data-testid="json-shape-properties-value"]').should('have.text', '2');
  cy.get('[data-testid="json-shape-types"]').should('contain.text', 'string');
});

And(/^I see the shape placeholder$/, function () {
  cy.get('[data-testid="schema-empty"]').should('be.visible');
});

Then(/^I see the nested shapes statistics$/, function () {
  cy.get('[data-testid="json-shape-nested"]').should('be.visible');
  cy.get('[data-testid="json-shape-node"]').should('have.length', 2);
  cy.get('[data-testid="json-shape-node-path"]').should('contain.text', 'slideshows');
});