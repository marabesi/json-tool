const { When, Then } = require("cypress-cucumber-preprocessor/steps");

const url = '/';

When(/^I open json tool$/, function () {
    cy.visit(url);
});

Then(/^I see label to inform where to place the json$/, function () {
    cy.get('[data-testid="label-json"]').should('have.text', 'place your json here');
});

Then(/^I see buy me a coffee link$/, function () {
    cy.get('[data-testid="buy-me-a-coffee"]').should('be.visible');
    cy.get('[data-testid="buy-me-a-coffee"]').should('have.attr', 'href', 'https://www.buymeacoffee.com/marabesi');
});

Then(/^I see a label to inform the result of formatting$/, function () {
    cy.get('[data-testid="label-result"]').should('have.text', 'result');
});

Then(/^I see (\d+) as the default space size$/, function () {
    cy.get('[data-testid="space-size"]').should('have.value', '2');
});