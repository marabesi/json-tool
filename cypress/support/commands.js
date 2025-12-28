import 'cypress-file-upload';
import { waitFor } from './configuration';

// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('withInputEditor', () => {
  return cy.get('[data-testid="json"] [role="textbox"]');
});

Cypress.Commands.add('withOutputEditor', () => {
  return cy.get('[data-testid="result"] [role="textbox"]');
});

Cypress.Commands.add('withError', () => {
  return cy.get('[data-testid="error"]');
});

Cypress.Commands.add('withBuyMeAcoffeeLink', () => {
  return cy.get('[data-testid="buy-me-a-coffee"]');
});

Cypress.Commands.add('withCleanTheEditorsButton', () => {
  return cy.get('[data-testid="copy-json"]');
});

Cypress.Commands.add('withCleanNewLinesButton', () => {
  return cy.get('[data-testid="clean-new-lines"]');
});

Cypress.Commands.add('withSpaceSizeInput', () => {
  return cy.get('[data-testid="space-size"]');
});

Cypress.Commands.add('withCleanSpacesButton', () => {
  return cy.get('[data-testid="clean-spaces"]');
});

Cypress.Commands.add('withPasteFromClipboardButton', () => {
  return cy.get('[data-testid="paste-from-clipboard"]');
});

Cypress.Commands.add('withCleanNewLinesAndSpacesButton', () => {
  return cy.get('[data-testid="clean-new-lines-and-spaces"]');
});

Cypress.Commands.add('withCleanAllButton', () => {
  return cy.get('[data-testid="clean"]');
});

Cypress.Commands.add('writeAndWait', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject)
    .invoke('text', text)
    .wait(waitFor);
});

Cypress.Commands.add('goToSettings', () => {
  return cy.get('[data-testid="settings"]');
});

Cypress.Commands.add('withTitle', () => {
  return cy.get('h1');
});