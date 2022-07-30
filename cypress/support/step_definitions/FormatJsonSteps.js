const { When, Then } = require('cypress-cucumber-preprocessor/steps');

When(/^I open json tool with valid json string$/, function () {
  cy.visit('/');
  cy.withInputEditor().type('{}');
});

Then(/^I see the same json in the right editor$/, function () {
  cy.withOutputEditor().should(
    ($div) => {
      expect($div.get(0).innerText).to.eq('{}');
    }
  );
});

When(/^I open json tool with an invalid json string$/, function () {
  cy.visit('/');
  cy.withInputEditor().type('this is not a json');
  cy.withOutputEditor().should(
    ($div) => {
      expect($div.get(0).innerText).to.eq('this is not a json');
    }
  );
});

Then(/^I see an error message$/, function () {
  cy.get('[data-testid="error"]').should('have.text', 'invalid json');
});
