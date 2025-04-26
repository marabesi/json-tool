const { When, Then } = require('cypress-cucumber-preprocessor/steps');

When(/^I place a json string with new lines and white spaces$/, function () {
  this.jsonWithNewLinesAndSpaces = `{
  "test" : "test",
  "name" : "json from clipboard"
}`;

  cy.withInputEditor().writeAndWait(this.jsonWithNewLinesAndSpaces);
});

When(/^I click to clean white spaces and new lines$/, function () {
  return cy.withCleanNewLinesAndSpacesButton().click();
});

Then(/^I see the json with new lines and white spaces in the left editor$/, function () {
  // cy.get('[data-testid="json"]').should('have.value', this.jsonWithNewLinesAndSpaces);
  return 'pending';
});

Then(/^I see the json without new lines and white spaces in the right editor$/, function () {
  cy.withOutputEditor().should(($div) => {
    expect($div.get(0).innerText).to.eq('{"test":"test","name":"json from clipboard"}');
  });
});
