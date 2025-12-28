const { When, Then, And } = require('cypress-cucumber-preprocessor/steps');

const url = '/';

When(/^I open json tool$/, function () {
  cy.visit(url);
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

When(/^I go to docs$/, function () {
  cy.goToDocs().click();
});

Then(/^I see the docs page$/, function () {
  cy.withTitle().should('have.text', 'JSON tool docs');
});