const { When, Then } = require('cypress-cucumber-preprocessor/steps');
const { waitFor } = require('../configuration');

const inputJson = '{"name":"json from clipboard"}';

When(/^I place a json string in the editor$/, function () {
  cy.withInputEditor()
    .invoke('text', inputJson)
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

When(/^I click to clean the editor with ctrl z$/, function () {
  if (Cypress.platform === 'darwin') {
    cy.withInputEditor().type('{cmd}{z}');
  } else {
    cy.withInputEditor().type('{ctrl}{z}');
  }
});
