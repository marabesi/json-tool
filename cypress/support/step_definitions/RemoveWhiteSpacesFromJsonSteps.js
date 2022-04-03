const { When, Then } = require("cypress-cucumber-preprocessor/steps");

When(/^I open json tool with valid json with white spaces$/, function () {
    cy.visit('/');
    this.jsonWithSpaces = '{"name" : "json from clipboard"}';

    cy.get('[data-testid="json"]').type(this.jsonWithSpaces, { parseSpecialCharSequences: false });
});

When(/^I click to remove white spaces$/, function () {
    cy.get('[data-testid="clean-spaces"]').click();
});

Then(/^I see a json without white spaces$/, function () {
    cy.get('[data-testid="json"]').should('have.value', this.jsonWithSpaces);
    cy.get('[data-testid="result"]').should('have.value', '{"name":"json from clipboard"}');
});
