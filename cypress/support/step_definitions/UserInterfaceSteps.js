const { When, Then } = require('cypress-cucumber-preprocessor/steps');

const url = '/';

When(/^I open json tool$/, function () {
  cy.visit(url);
});

Then(/^I see buy me a coffee link$/, function () {
  cy.withBuyMeAcoffeeLink().should('be.visible');
  cy.withBuyMeAcoffeeLink().should('have.attr', 'href', 'https://www.buymeacoffee.com/marabesi');
});

Then(/^I see (\d+) as the default space size$/, function () {
  cy.withSpaceSizeInput().should('have.value', '2');
});
