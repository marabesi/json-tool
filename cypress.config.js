const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require('cypress');
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin');

module.exports = defineConfig({
  viewportHeight: 920,
  viewportWidth: 1280,
  env: {
    cypressImageDiff: {
      FAILURE_THRESHOLD: 0.1,
    }
  },
  e2e: {
    'projectId': 'wpcwmv',
    'watchForFileChanges': false,
    'specPattern': [
      'cypress/e2e/**/*.feature',
      'cypress/regression/**/*.spec.js'
    ],
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
      getCompareSnapshotsPlugin(on, config);
    }
  }
});
