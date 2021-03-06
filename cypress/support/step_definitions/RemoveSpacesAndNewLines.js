const { When, Then } = require('cypress-cucumber-preprocessor/steps');

When(/^I place a json string with new lines and white spaces$/, function () {
  this.jsonWithNewLinesAndSpaces = `{
  "test" : "test",
  "name" : "json from clipboard"
}`;

  cy.get('[data-testid="json"] .cm-content').type(this.jsonWithNewLinesAndSpaces, { parseSpecialCharSequences: true });
});

When(/^I click to clean white spaces and new lines$/, function () {
  cy.get('[data-testid="clean-new-lines-and-spaces"]').click();
});

Then(/^I see the json with new lines and white spaces in the left editor$/, function () {
  // cy.get('[data-testid="json"]').should('have.value', this.jsonWithNewLinesAndSpaces);
  return 'pending';
});

Then(/^I see the json without new lines and white spaces in the right editor$/, function () {
  cy.get('[data-testid="result"] .cm-content').should(($div) => {
    expect($div.get(0).innerText).to.eq('{"test":"test","name":"json from clipboard"}');
  });
});
