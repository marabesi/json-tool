describe('index page', () => {
  it('should display the login page correctly', () => {
    cy.visit('/');
    cy.compareSnapshot('index', 0.0);
  });
});