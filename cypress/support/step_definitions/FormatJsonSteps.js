const { When, Then } = require("cypress-cucumber-preprocessor/steps");

When(/^I open json tool with valid json string$/, function () {
    cy.visit('/');
    cy.get('[data-testid="json"]').type('{}');
});

Then(/^I see the same json in the right editor$/, function () {
    cy.get('[data-testid="result"]').should('have.value', '{}');
});

When(/^I open json tool with an invalid json string$/, function () {
    cy.visit('/');
    cy.get('[data-testid="json"]').type('this is not a json');
    cy.get('[data-testid="result"]').should('have.value', 'this is not a json');
});

Then(/^I see an error message$/, function () {
    cy.get('[data-testid="error"]').should('have.text', 'invalid json');
});