const { When, Then } = require("cypress-cucumber-preprocessor/steps");

const inputJson = '{"name":"json from clipboard"}';

When(/^I place a json string in the editor$/, function () {
    cy.get('[data-testid="json"] .cm-content').type(inputJson, { parseSpecialCharSequences: false });
});

When(/^I click to clean the editor$/, function () {
    cy.get('[data-testid="clean"]').click();
});

Then(/^I see both editors empty$/, function () {
    cy.get('[data-testid="json"] .cm-content').should(
        ($div) => {
            expect($div.get(0).innerText).to.eq('\n');
        }
    );
    cy.get('[data-testid="result"] .cm-content').should(
        ($div) => {
            expect($div.get(0).innerText).to.eq('\n');
        }
    );
});
