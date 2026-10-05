const { When, Then, And } = require('cypress-cucumber-preprocessor/steps');

When(/^I drag the editor resizer to the right$/, function () {
  cy.withEditorResizer().then(($resizer) => {
    const rect = $resizer[0].getBoundingClientRect();
    const startX = rect.left + rect.width / 2;

    cy.wrap($resizer).trigger('mousedown', { which: 1, clientX: startX });
    cy.get('body').trigger('mousemove', { clientX: startX + 150 });
    cy.get('body').trigger('mouseup');
  });
});

Then(/^the editors are not split equally anymore$/, function () {
  cy.withEditorLeft().should(($editor) => {
    expect(parseFloat($editor[0].style.flexGrow)).to.be.greaterThan(50);
  });
});

And(/^I press the left arrow on the editor resizer$/, function () {
  cy.withEditorResizer().trigger('keydown', { key: 'ArrowLeft' });
});

Then(/^the left editor becomes narrower$/, function () {
  cy.withEditorLeft().should(($editor) => {
    expect(parseFloat($editor[0].style.flexGrow)).to.be.lessThan(50);
  });
});

And(/^I drag the editor resizer to the minimum$/, function () {
  cy.withEditorResizer().then(($resizer) => {
    const rect = $resizer[0].getBoundingClientRect();
    const startX = rect.left + rect.width / 2;

    cy.wrap($resizer).trigger('mousedown', { which: 1, clientX: startX });
    cy.get('body').trigger('mousemove', { clientX: 0 });
    cy.get('body').trigger('mouseup');
  });
});

Then(/^the editor menus do not overlap$/, function () {
  cy.withJsonMenu().then(($left) => {
    cy.withResultMenu().then(($right) => {
      const leftRect = $left[0].getBoundingClientRect();
      const rightRect = $right[0].getBoundingClientRect();

      expect(leftRect.right).to.be.at.most(rightRect.left + 1);
    });
  });
});

Then(/^I see the editor resizer$/, function () {
  cy.withEditorResizer().should('be.visible');
});

And(/^I see the input editor menu$/, function () {
  cy.withJsonMenu().should('be.visible');
  cy.withEditorLeft().find('[data-testid="paste-from-clipboard"]').should('be.visible');
});

Then(/^the editor menus show only icons$/, function () {
  cy.withJsonMenu().should('not.contain.text', 'Paste from clipboard');
  cy.withResultMenu().should('not.contain.text', 'Clean spaces');
  cy.withEditorLeft().find('[data-testid="paste-from-clipboard"]').should('be.visible');
  cy.withResultMenu().find('[data-testid="copy-json"]').should('be.visible');
});

And(/^the menu actions have a title$/, function () {
  cy.withEditorLeft().find('[data-testid="paste-from-clipboard"]').should('have.attr', 'title', 'Paste from clipboard');
  cy.withEditorLeft().find('[data-testid="clean"]').should('have.attr', 'title', 'Delete all');
  cy.withResultMenu().find('[data-testid="copy-json"]').should('have.attr', 'title', 'Copy json');
});
