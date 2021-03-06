const { When, Then } = require("cypress-cucumber-preprocessor/steps");

When(/^I open json tool with valid json with white spaces$/, function () {
    cy.visit('/');
    this.jsonWithSpaces = '{"name" : "json from clipboard"}';

    cy.get('[data-testid="json"] .cm-content').type(this.jsonWithSpaces, { parseSpecialCharSequences: false, delay: 50 });
});

When(/^I click to remove white spaces$/, function () {
    cy.get('[data-testid="clean-spaces"]').click();
});

Then(/^I see a json without white spaces$/, function () {
    cy.get('[data-testid="json"] .cm-content').should(
        ($div) => {
        expect($div.get(0).innerText).to.eq(this.jsonWithSpaces);
    }
);
    cy.get('[data-testid="result"] .cm-content').should(
        ($div) => {
            expect($div.get(0).innerText).to.eq('{"name":"json from clipboard"}');
        }
    );
});
