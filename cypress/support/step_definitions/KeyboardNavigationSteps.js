const { When, Then, And } = require('cypress-cucumber-preprocessor/steps');

function pressKey(key, options = {}) {
  cy.window().then((win) => {
    const activeElement = win.document.activeElement;
    const target = activeElement !== null && activeElement !== win.document.body
      ? activeElement
      : win.document.body;

    target.dispatchEvent(new win.KeyboardEvent('keydown', {
      key,
      code: options.code,
      altKey: options.altKey ?? false,
      shiftKey: options.shiftKey ?? false,
      ctrlKey: options.ctrlKey ?? false,
      metaKey: options.metaKey ?? false,
      bubbles: true,
      cancelable: true,
    }));
  });
}

When(/^I press the Alt\+(\d) shortcut$/, function (number) {
  pressKey(number, { code: `Digit${number}`, altKey: true });
});

When(/^I press the Alt\+([A-Z]) shortcut$/, function (letter) {
  pressKey(letter.toLowerCase(), { code: `Key${letter}`, altKey: true });
});

When(/^I press the Alt\+Shift\+([A-Z]) shortcut$/, function (letter) {
  pressKey(letter.toLowerCase(), { code: `Key${letter}`, altKey: true, shiftKey: true });
});

When(/^I press the Alt\+Enter shortcut$/, function () {
  pressKey('Enter', { code: 'Enter', altKey: true });
});

When(/^I press the Alt\+Delete shortcut$/, function () {
  pressKey('Delete', { code: 'Delete', altKey: true });
});

When(/^I press the Alt\+Home shortcut$/, function () {
  pressKey('Home', { code: 'Home', altKey: true });
});

When(/^I press the question mark key$/, function () {
  pressKey('?', { code: 'Slash', shiftKey: true });
});

When(/^I press Escape$/, function () {
  pressKey('Escape', { code: 'Escape' });
});

Then(/^I see the home view$/, function () {
  cy.get('[data-testid="editors-page"]').should('be.visible');
});

Then(/^I see the table view$/, function () {
  cy.get('[data-testid="table-page"]').should('be.visible');
});

Then(/^I see the shape view$/, function () {
  cy.get('[data-testid="schema-page"]').should('be.visible');
});

Then(/^I see the diff view$/, function () {
  cy.get('[data-testid="diff-page"]').should('be.visible');
});

Then(/^I see the keyboard shortcuts$/, function () {
  cy.get('[data-testid="keyboard-shortcuts"]').should('be.visible');
});

Then(/^I do not see the keyboard shortcuts$/, function () {
  cy.get('[data-testid="keyboard-shortcuts"]').should('not.exist');
});

And(/^I open the keyboard shortcuts from the header$/, function () {
  cy.get('[data-testid="keyboard-shortcuts-open"]').click();
});

And(/^I close the keyboard shortcuts$/, function () {
  cy.get('[data-testid="keyboard-shortcuts-close"]').click();
});

And(/^I open the history drawer$/, function () {
  cy.get('[data-testid="json-drawer-history-button"]').click();
});

Then(/^the history drawer is closed$/, function () {
  cy.get('[data-testid="drawer"]').should('not.have.class', 'opacity-100');
});

When(/^I type a json in the input editor$/, function () {
  cy.withInputEditor().writeAndWait('{"a":1}');
});

Then(/^validate json is disabled$/, function () {
  cy.get('[data-testid="is-validate-json"]').should('not.be.checked');
});

Then(/^sync scroll is enabled$/, function () {
  cy.get('[data-testid="is-sync-scroll"]').should('be.checked');
});

Then(/^dark mode is enabled$/, function () {
  cy.get('[data-testid="app-container"]').should('have.class', 'dark');
});

Then(/^the input editor is empty$/, function () {
  cy.get('[data-testid="raw-json"]').should('have.value', '');
});

Then(/^the result is cleaned$/, function () {
  cy.get('[data-testid="raw-result"]').should(($input) => {
    expect($input.val().replace(/\n/g, '')).to.equal('{"a":1}');
  });
});

Then(/^the table search has focus$/, function () {
  cy.get('[data-testid="table-search"]').should('have.focus');
});

Then(/^exact match is enabled$/, function () {
  cy.get('[data-testid="table-exact-match"]').should('be.checked');
});

Then(/^the working editor has focus$/, function () {
  cy.get('[data-testid="json"] .cm-content').should('have.focus');
});

Then(/^the result editor has focus$/, function () {
  cy.get('[data-testid="result"] .cm-content').should('have.focus');
});
