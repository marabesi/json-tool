const { When, Then } = require("cypress-cucumber-preprocessor/steps");

When(/^I place a valid json string with new lines$/, function () {
this.jsonWithNewLines = `{
  "name" : "json from clipboard"}`;
    cy.get('[data-testid="json"]').type(this.jsonWithNewLines, { parseSpecialCharSequences: false });
});

When(/^I click to remove new lines$/, function () {
    cy.get('[data-testid="clean-new-lines"]').click();
});

Then(/^I see the json with new line in the left editor$/, function () {
    cy.get('[data-testid="json"]').should('have.value', this.jsonWithNewLines);
});

Then(/^I see a json without new lines in the right editor$/, function () {
    cy.get('[data-testid="result"]').should('have.value', '{  "name" : "json from clipboard"}');
});