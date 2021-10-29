describe('json tool', () => {
  const url = '/';

  describe('User interface information', () => {
    it('label to inform where to place the json', () => {
      cy.visit(url);
      cy.get('[data-testid="label-json"]').should('have.text', 'place your json here');
    });

    it('label to inform the result of formatting', () => {
      cy.visit(url);
      cy.get('[data-testid="label-result"]').should('have.text', 'result');
    });
  });

  describe('Basic behavior', () => {
    it('format valid json string', () => {
      cy.visit(url);
      cy.get('[data-testid="json"]').type('{}');
      cy.get('[data-testid="result"]').should('have.value', '{}');
    });

    it('shows an error message when json is invalid', () => {
      cy.visit(url);
      cy.get('[data-testid="json"]').type('this is not a json');
      cy.get('[data-testid="result"]').should('have.value', 'this is not a json');
      cy.get('[data-testid="error"]').should('have.text', 'invalid json');
    });
  });

  describe('Editors functionality', () => {
    const inputJson = '{"name":"json from clipboard"}';
    const desiredJson = '{\n  "name": "json from clipboard"\n}';

    it('should place text from clipboard in the editor on click button', () => {
      cy.visit(url);
  
      cy.window()
        .its('navigator.clipboard')
        .invoke('writeText', inputJson);
  
      cy.get('[data-testid="paste-from-clipboard"]').click();
  
      cy.get('[data-testid="json"]').should('have.value', inputJson);
      cy.get('[data-testid="result"]').should('have.value', desiredJson);
    });

    it('should copy text from clipboard in the editor on click button', () => {
      cy.visit(url);
  
      cy.get('[data-testid="json"]').type(inputJson, { parseSpecialCharSequences: false });
      cy.get('[data-testid="copy-json"]').click();
  
       cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          assert.equal(text, desiredJson);
        });
      });
    });

    it('should clean both editors source and result', () => {
      cy.visit(url);
  
      cy.get('[data-testid="json"]').type(inputJson, { parseSpecialCharSequences: false });
  
      cy.get('[data-testid="clean"]').click();
  
      cy.get('[data-testid="json"]').should('have.value', '');
      cy.get('[data-testid="result"]').should('have.value', '');
    });
  });
});
