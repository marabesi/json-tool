const { When, Then, And } = require('cypress-cucumber-preprocessor/steps');

const url = '/';

When(/^I open json tool$/, function () {
  cy.visit(url);
  cy.get('[data-testid="json-menu"]').should('be.visible');
});

And(/^I go to settings$/, function () {
  cy.goToSettings().click();
});

Then(/^I see buy me a coffee link$/, function () {
  cy.withBuyMeAcoffeeLink().should('be.visible');
  cy.withBuyMeAcoffeeLink().should('have.attr', 'href', 'https://www.buymeacoffee.com/marabesi');
});

Then(/^I see (\d+) as the default space size$/, function () {
  cy.withSpaceSizeInput().should('have.value', '2');
});

Then(/^I see the settings options$/, function () {
  cy.withTitle().should('have.text', 'Settings');
});

Then(/^I see the docs link$/, function () {
  cy.goToDocs()
    .should('be.visible')
    .should('contain', 'Docs')
    .should('have.attr', 'href', './docs/')
    .should('have.attr', 'target', '_blank');
});

Then(/^I see the home view$/, function () {
  cy.get('[data-testid="editors-page"]').should('be.visible');
});

Then(/^I see the table view$/, function () {
  cy.get('[data-testid="table-page"]').should('be.visible');
});

Then(/^I see the shape view$/, function () {
  cy.get('[data-testid="schema-page"]').should('be.visible');
});

Then(/^I see the diff view$/, function () {
  cy.get('[data-testid="diff-page"]').should('be.visible');
});

Then(/^I see the keyboard shortcuts$/, function () {
  cy.get('[data-testid="keyboard-shortcuts"]').should('be.visible');
});

Then(/^I do not see the keyboard shortcuts$/, function () {
  cy.get('[data-testid="keyboard-shortcuts"]').should('not.exist');
});

And(/^I open the keyboard shortcuts from the header$/, function () {
  cy.get('[data-testid="keyboard-shortcuts-open"]').click();
});

And(/^I close the keyboard shortcuts$/, function () {
  cy.get('[data-testid="keyboard-shortcuts-close"]').click();
});

Then(/^validate json is disabled$/, function () {
  cy.get('[data-testid="is-validate-json"]').should('not.be.checked');
});

Then(/^sync scroll is enabled$/, function () {
  cy.get('[data-testid="is-sync-scroll"]').should('be.checked');
});

Then(/^dark mode is enabled$/, function () {
  cy.get('[data-testid="app-container"]').should('have.class', 'dark');
});

Then(/^the working editor has focus$/, function () {
  cy.get('[data-testid="json"] .cm-content').should('have.focus');
});

Then(/^the result editor has focus$/, function () {
  cy.get('[data-testid="result"] .cm-content').should('have.focus');
});

And(/^I open the history drawer$/, function () {
  cy.get('[data-testid="json-drawer-history-button"]').click();
});

Then(/^the history drawer is closed$/, function () {
  cy.get('[data-testid="drawer"]').should('not.have.class', 'opacity-100');
});
