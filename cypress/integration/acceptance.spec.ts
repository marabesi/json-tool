const inputJson = '{"name":"json from clipboard"}';
const desiredJson = '{\n  "name": "json from clipboard"\n}';

describe('json tool', () => {
  const url = '/';

  beforeEach(() => {
    cy.visit(url);
  });

  it('should remove white spaces from json', () => {
    const jsonWithSpaces = '{"name" : "json from clipboard"}';

    cy.get('[data-testid="json"]').type(jsonWithSpaces, { parseSpecialCharSequences: false });

    cy.get('[data-testid="clean-spaces"]').click();

    cy.get('[data-testid="json"]').should('have.value', jsonWithSpaces);
    cy.get('[data-testid="result"]').should('have.value', '{"name":"json from clipboard"}');
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

  describe('User interface information', () => {
    it('label to inform where to place the json', () => {
      cy.get('[data-testid="label-json"]').should('have.text', 'place your json here');
    });

    it('label to inform the result of formatting', () => {
      cy.get('[data-testid="label-result"]').should('have.text', 'result');
    });

    it('shoulde have 2 as the default space size', () => {
      cy.get('[data-testid="space-size"]').should('have.value', '2');
    });
  });

  describe('Basic behavior', () => {
    it('format valid json string', () => {
      cy.get('[data-testid="json"]').type('{}');
      cy.get('[data-testid="result"]').should('have.value', '{}');
    });

    it('shows an error message when json is invalid', () => {
      cy.get('[data-testid="json"]').type('this is not a json');
      cy.get('[data-testid="result"]').should('have.value', 'this is not a json');
      cy.get('[data-testid="error"]').should('have.text', 'invalid json');
    });
  });

  describe('clean editor', () => {
    it('should clean both editors source and result', () => {
      cy.get('[data-testid="json"]').type(inputJson, { parseSpecialCharSequences: false });

      cy.get('[data-testid="clean"]').click();

      cy.get('[data-testid="json"]').should('have.value', '');
      cy.get('[data-testid="result"]').should('have.value', '');
    });
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
