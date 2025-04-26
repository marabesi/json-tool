const { When, Then } = require('cypress-cucumber-preprocessor/steps');
const { waitFor } = require('../configuration');

When(/^I place a valid json string with new lines$/, function () {
  this.jsonWithNewLines = `{
  "name" : "json from clipboard"
}`;
  cy.withInputEditor()
    .invoke('text', this.jsonWithNewLines)
    .wait(waitFor);
});

When(/^I click to remove new lines$/, function () {
  cy.withCleanNewLinesButton().click();
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
    expect($div.get(0).innerText).to.eq('{  "name" : "json from clipboard"}');
  });
});
