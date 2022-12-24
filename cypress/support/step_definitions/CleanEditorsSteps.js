const { When, Then } = require('cypress-cucumber-preprocessor/steps');
const { waitFor } = require('../configuration');

const inputJson = '{"name":"json from clipboard"}';

When(/^I place a json string in the editor$/, function () {
  cy.withInputEditor()
    .type(inputJson, { parseSpecialCharSequences: false, delay: 50 })
    .wait(waitFor);
});

When(/^I click to clean the editor$/, function () {
  cy.withCleanAllButton().click();
});

Then(/^I see both editors empty$/, function () {
  cy.withInputEditor().should(
    ($div) => {
      expect($div.get(0).innerText).to.eq('\n');
    }
  );
  cy.withOutputEditor().should(
    ($div) => {
      expect($div.get(0).innerText).to.eq('\n');
    }
  );
});
