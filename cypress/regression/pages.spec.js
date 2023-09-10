describe.only('visual testing regression', () => {
  const visit = (path, darkAppearance) =>
    cy.visit(path, {
      onBeforeLoad(win) {
        cy.stub(win, 'matchMedia')
          .withArgs('(prefers-color-scheme: dark)')
          .returns({
            matches: darkAppearance,
          });
      },
    });

  it('should display the index page', () => {
    cy.viewport(1280, 920);
    visit('/', true);
    cy.wait(3000);
    cy.compareSnapshot('index', 0.1);
  });

  it('should display the settings page', () => {
    cy.viewport(1280, 920);
    visit('/#/settings', true);
    cy.wait(3000);
    cy.compareSnapshot('settings', 0.1);
  });
});