const { When, Then } = require("cypress-cucumber-preprocessor/steps");

const url = '/';

When(/^I open json tool$/, function () {
    cy.visit(url);
});

Then(/^I see buy me a coffee link$/, function () {
    cy.get('[data-testid="buy-me-a-coffee"]').should('be.visible');
    cy.get('[data-testid="buy-me-a-coffee"]').should('have.attr', 'href', 'https://www.buymeacoffee.com/marabesi');
});

Then(/^I see (\d+) as the default space size$/, function () {
    cy.get('[data-testid="space-size"]').should('have.value', '2');
});
