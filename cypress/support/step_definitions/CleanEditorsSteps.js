const { When, Then } = require("cypress-cucumber-preprocessor/steps");

const inputJson = '{"name":"json from clipboard"}';

When(/^I place a json string in the editor$/, function () {
    cy.get('[data-testid="json"]').type(inputJson, { parseSpecialCharSequences: false });
});

When(/^I click to clean the editor$/, function () {
    cy.get('[data-testid="clean"]').click();
});

Then(/^I see both editors empty$/, function () {
    cy.get('[data-testid="json"]').should('have.value', '');
    cy.get('[data-testid="result"]').should('have.value', '');
});