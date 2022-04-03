const inputJson = '{"name":"json from clipboard"}';
const desiredJson = '{\n  "name": "json from clipboard"\n}';

describe('json tool', () => {
  const url = '/';

  beforeEach(() => {
    cy.visit(url);
  });
});
