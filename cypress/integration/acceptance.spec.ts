const inputJson = '{"name":"json from clipboard"}';
const desiredJson = '{\n  "name": "json from clipboard"\n}';

describe('json tool', () => {
  const url = '/';

  beforeEach(() => {
    cy.visit(url);
  });

  it('should remove new lines from json', () => {
    const jsonWithNewLines = `{
  "name" : "json from clipboard"}`;

    cy.get('[data-testid="json"]').type(jsonWithNewLines, { parseSpecialCharSequences: false });

    cy.get('[data-testid="clean-new-lines"]').click();

    cy.get('[data-testid="json"]').should('have.value', jsonWithNewLines);
    cy.get('[data-testid="result"]').should('have.value', '{  "name" : "json from clipboard"}');
  });

  it('should remove spaces and new lines from json', () => {
    const jsonWithNewLinesAndSpaces = `{
  "test" : "test",
  "name" : "json from clipboard"}`;

    cy.get('[data-testid="json"]').type(jsonWithNewLinesAndSpaces, { parseSpecialCharSequences: false });

    cy.get('[data-testid="clean-new-lines-and-spaces"]').click();

    cy.get('[data-testid="result"]').should('have.value', '{"test":"test","name":"json from clipboard"}');
  });

  describe('Editors functionality', () => {
    it('should place text from clipboard in the editor on click button', () => {
      cy.window()
          .its('navigator.clipboard')
          .invoke('writeText', inputJson);

      cy.get('[data-testid="paste-from-clipboard"]').click();

      cy.get('[data-testid="json"]').should('have.value', inputJson);
      cy.get('[data-testid="result"]').should('have.value', desiredJson);
    });

    it('should copy text from clipboard in the editor on click button', () => {
      cy.get('[data-testid="json"]').type(inputJson, { parseSpecialCharSequences: false });
      cy.get('[data-testid="copy-json"]').click();

      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          assert.equal(text, desiredJson);
        });
      });
    });

  });
});
