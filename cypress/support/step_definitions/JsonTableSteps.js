const { When, Then, And } = require('cypress-cucumber-preprocessor/steps');

const tableJson = '[{"product":"Laptop","inStock":true},{"product":"Mouse","inStock":false}]';

When(/^I open json tool with a json array$/, function () {
  cy.visit('/');
  cy.withInputEditor().writeAndWait(tableJson);
});

And(/^I go to the table$/, function () {
  cy.goToTable().click();
});

Then(/^I see the json array as a table$/, function () {
  cy.withJsonTable().should('be.visible');
  cy.withJsonTable().should('contain.text', 'product');
  cy.withJsonTable().should('contain.text', 'Laptop');
  cy.withJsonTable().should('contain.text', 'Mouse');
});

And(/^I expand the table$/, function () {
  cy.withToggleFullscreen().click();
});

Then(/^I see the table in full screen$/, function () {
  cy.withTablePane().should('have.attr', 'data-fullscreen', 'true');
  cy.withToggleFullscreen().should('have.text', 'Exit full screen');
});

And(/^I collapse the table$/, function () {
  cy.withToggleFullscreen().click();
});

Then(/^I see the table in its regular size$/, function () {
  cy.withTablePane().should('have.attr', 'data-fullscreen', 'false');
  cy.withToggleFullscreen().should('have.text', 'Full screen');
});

And(/^I search the table for "([^"]*)"$/, function (term) {
  cy.withTableSearch().clear().type(term);
});

Then(/^I see "([^"]*)" in the table$/, function (value) {
  cy.withJsonTable().should('contain.text', value);
});

And(/^I do not see "([^"]*)" in the table$/, function (value) {
  cy.withJsonTable().should('not.contain.text', value);
});

Then(/^I see no matching data$/, function () {
  cy.get('[data-testid="json-table-no-match"]').should('be.visible');
});
