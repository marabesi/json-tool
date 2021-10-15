describe('json utility tool', () => {
  const url = 'http://localhost:3000';

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

  it('should place text from clipboard in the editor on click button', () => {
    cy.visit(url);
    const inputJson = '{"name":"json from clipboard"}';
    const desiredJson = '{\n  "name": "json from clipboard"\n}';

    cy.window()
      .its('navigator.clipboard')
      .invoke('writeText', inputJson);

    cy.get('[data-testid="paste-from-clipboard"]').click();

    cy.get('[data-testid="json"]').should('have.value', inputJson);
    cy.get('[data-testid="result"]').should('have.value', desiredJson);
  });
});
