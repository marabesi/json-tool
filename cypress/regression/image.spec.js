describe('index page', () => {
  it('should display the login page correctly', () => {
    cy.visit('/');
    cy.wait(3000);
    cy.compareSnapshot('image', 0);
  });
});