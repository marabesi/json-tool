const { When, Then, And } = require('cypress-cucumber-preprocessor/steps');

const originalJson = '{"name":"Ada","age":36}';
const changedJson = '{"name":"Grace","email":"grace@example.com"}';

When(/^I open json tool with the original json to diff$/, function () {
  cy.visit('/');
  cy.withInputEditor().writeAndWait(originalJson);
});

And(/^I go to the diff$/, function () {
  cy.goToDiff().click();
});

And(/^I compare with a changed json$/, function () {
  cy.withDiffComparedEditor().writeAndWait(changedJson);
});

And(/^I compare with the same json$/, function () {
  cy.withDiffComparedEditor().writeAndWait(originalJson);
});

And(/^I compare with an invalid json$/, function () {
  cy.withDiffComparedEditor().writeAndWait('{invalid json');
});

Then(/^I see the json differences$/, function () {
  cy.get('[data-testid="json-diff"]').should('be.visible');
  cy.get('[data-testid="json-diff-entry-path"]').should('contain.text', '$.name');
  cy.get('[data-testid="json-diff-entry-path"]').should('contain.text', '$.age');
  cy.get('[data-testid="json-diff-entry-path"]').should('contain.text', '$.email');
});

Then(/^I see (\d+) added differences?$/, function (count) {
  cy.get('[data-testid="json-diff-added-value"]').should('have.text', count);
});

Then(/^I see (\d+) removed differences?$/, function (count) {
  cy.get('[data-testid="json-diff-removed-value"]').should('have.text', count);
});

Then(/^I see (\d+) changed differences?$/, function (count) {
  cy.get('[data-testid="json-diff-changed-value"]').should('have.text', count);
});

Then(/^I see the diff placeholder$/, function () {
  cy.get('[data-testid="diff-empty"]').should('be.visible');
});

Then(/^I see that both documents are identical$/, function () {
  cy.get('[data-testid="json-diff-identical"]').should('be.visible');
});

Then(/^I see the diff error$/, function () {
  cy.get('[data-testid="diff-error"]').should('be.visible');
  cy.get('[data-testid="diff-error"]').should('have.text', 'invalid json');
});
