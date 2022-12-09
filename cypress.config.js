const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    'projectId': 'wpcwmv',
    'watchForFileChanges': false,
    'specPattern': '**/*.feature',
    'viewportHeight': 920,
    'viewportWidth': 1280,
    setupNodeEvents(on) {
      on('file:preprocessor', cucumber());
    }
  }
});
