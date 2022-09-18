const { When, Then } = require('cypress-cucumber-preprocessor/steps');

const desiredJson = '{\n  "a": "a"\n}';

When(/^I upload a json file in the left editor$/, function () {
  const fileName = 'unformatted.json';
  cy.fixture(fileName)
    .then(fileJson => {
      const fileContent = JSON.stringify(fileJson);
      cy.get('[data-testid="upload-json"]').attachFile({ fileContent, fileName, mimeType: 'application/json', encoding: 'utf8', filePath: '/tmp/json.json' });
    });
});

Then(/^I see the uploaded json content in the right editor/, function() {
  cy.withOutputEditor().should(
    ($div) => {
      expect($div.get(0).innerText).to.eq(desiredJson);
    }
  );
});
