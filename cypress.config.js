const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require('cypress');
const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin');

module.exports = defineConfig({
  env: {
    type: 'actual'
  },
  e2e: {
    'projectId': 'wpcwmv',
    'watchForFileChanges': false,
    'specPattern': [
      'cypress/e2e/**/*.feature',
      'cypress/regression/**/*.spec.js'
    ],
    'viewportHeight': 920,
    'viewportWidth': 1280,
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
      getCompareSnapshotsPlugin(on, config);
    }
  }
});
