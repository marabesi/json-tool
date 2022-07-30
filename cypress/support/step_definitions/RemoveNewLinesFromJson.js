const { When, Then } = require('cypress-cucumber-preprocessor/steps');

When(/^I place a valid json string with new lines$/, function () {
  this.jsonWithNewLines = `{
  "name" : "json from clipboard"
}`;
  cy.wait(1000);
  cy.get('[data-testid="json"]').type(this.jsonWithNewLines, { parseSpecialCharSequences: false, delay: 50 });
});

When(/^I click to remove new lines$/, function () {
  cy.get('[data-testid="clean-new-lines"]').click();
});

Then(/^I see the json with new line in the left editor$/, function () {
  cy.withInputEditor().should(
    ($div) => {
      expect($div.get(0).innerText).to.eq(`{
    "name" : "json from clipboard"
}`);
    }
  );
});

Then(/^I see a json without new lines in the right editor$/, function () {
  cy.withOutputEditor().should(($div) => {
    expect($div.get(0).innerText).to.eq('{    "name" : "json from clipboard"}');
  });
});
