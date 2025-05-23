const { When, Then } = require('cypress-cucumber-preprocessor/steps');

When(/^I open json tool with valid json with white spaces$/, function () {
  cy.visit('/');
  this.jsonWithSpaces = '{"name" : "json from clipboard"}';

  cy.withInputEditor().writeAndWait(this.jsonWithSpaces);
});

When(/^I click to remove white spaces$/, function () {
  cy.withCleanSpacesButton().click();
});

Then(/^I see a json without white spaces$/, function () {
  cy.withInputEditor().should(
    ($div) => {
      expect($div.get(0).innerText).to.eq(this.jsonWithSpaces);
    }
  );
  cy.withOutputEditor().should(
    ($div) => {
      expect($div.get(0).innerText).to.eq('{"name":"json from clipboard"}');
    }
  );
});
