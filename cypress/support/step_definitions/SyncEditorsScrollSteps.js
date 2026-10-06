const { When, And, Then } = require('cypress-cucumber-preprocessor/steps');

const scrollToBottom = ($scroller) => {
  $scroller[0].scrollTop = $scroller[0].scrollHeight;
  $scroller[0].dispatchEvent(new Event('scroll'));
};

When(/^I open json tool with a large json file$/, function () {
  cy.visit('/');

  cy.fixture('large.json').then((fileJson) => {
    cy.get('[data-testid="upload-json"]').attachFile({
      fileContent: fileJson,
      fileName: 'large.json',
      mimeType: 'application/json',
      encoding: 'utf8',
      filePath: '/tmp/large.json',
    });
  });

  cy.withOutputEditor().should('contain.text', '"key149"');
  cy.withInputEditor().should('contain.text', '"key149"');
});

And(/^I enable scroll synchronization$/, function () {
  cy.get('[data-testid="is-sync-scroll"]').check();
});

And(/^I scroll the json editor to the bottom$/, function () {
  cy.withInputEditorScroller().then(scrollToBottom);
});

And(/^I scroll the result editor to the bottom$/, function () {
  cy.withOutputEditorScroller().then(scrollToBottom);
});

Then(/^the result editor is scrolled$/, function () {
  cy.withOutputEditorScroller().should(($scroller) => {
    expect($scroller[0].scrollTop).to.be.greaterThan(0);
  });
});

Then(/^the json editor is scrolled$/, function () {
  cy.withInputEditorScroller().should(($scroller) => {
    expect($scroller[0].scrollTop).to.be.greaterThan(0);
  });
});

Then(/^the result editor is not scrolled$/, function () {
  cy.withOutputEditorScroller().should(($scroller) => {
    expect($scroller[0].scrollTop).to.equal(0);
  });
});
