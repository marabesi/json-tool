const { When, Then } = require('cypress-cucumber-preprocessor/steps');

const inputJson = '{"name":"json from clipboard"}';
const desiredJson = '{\n  "name": "json from clipboard"\n}';

When(/^I copy text into the clipboard$/, function () {
  cy.withInputEditor().focus();

  cy.window()
    .its('navigator.clipboard')
    .invoke('writeText', inputJson);
});

When(/^I click paste from clipboard$/, function () {
  cy.get('[data-testid="paste-from-clipboard"]').click();
});

Then(/^I see the copied content in the left editor$/, function () {
  cy.withInputEditor().should(
    ($div) => {
      expect($div.get(0).innerText).to.eq(inputJson);
    }
  );
});

Then(/^I see the copied content in the right editor$/, function () {
  cy.withOutputEditor().should(
    ($div) => {
      expect($div.get(0).innerText).to.eq(desiredJson);
    }
  );
});

When(/^I place a json string in the left editor$/, function () {
  cy.withInputEditor().type(inputJson, { parseSpecialCharSequences: false });
});

When(/^I click copy json to clipboard$/, function () {
  cy.withCleanTheEditorsButton().click();
});

Then(/^I see the copied content in the clipboard$/, function () {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((text) => {
      assert.equal(text, desiredJson);
    });
  });
});
