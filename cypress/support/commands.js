// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('withInputEditor', () => {
  return cy.get('[data-testid="json"] .cm-content');
});

Cypress.Commands.add('withOutputEditor', () => {
  return cy.get('[data-testid="result"] .cm-content');
});

Cypress.Commands.add('withError', () => {
  return cy.get('[data-testid="error"]');
});
