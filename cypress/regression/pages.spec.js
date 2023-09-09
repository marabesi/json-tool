describe('visual testing regression', () => {

  it('should display the index page', () => {
    cy.visit('/');
    cy.wait(3000);
    cy.compareSnapshot('index', 0);
  });

  it('should display the settings page', () => {
    cy.visit('/#/settings');
    cy.wait(3000);
    cy.compareSnapshot('settings', 0);
  });
});