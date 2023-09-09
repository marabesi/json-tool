describe('index page', () => {
  it.skip('should display the login page correctly', () => {
    cy.visit('/');
    cy.wait(3000);
    cy.compareSnapshot('index', 0.0);
  });
});