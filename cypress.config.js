const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require('cypress');
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin');
const coverage = require('@cypress/code-coverage/task');

module.exports = defineConfig({
  viewportHeight: 920,
  viewportWidth: 1280,
  env: {
    cypressImageDiff: {
      FAILURE_THRESHOLD: 0.5,
    }
  },
  e2e: {
    'projectId': 'wpcwmv',
    'watchForFileChanges': false,
    'specPattern': [
      'cypress/e2e/**/*.feature',
      //'cypress/regression/**/*.spec.js'
    ],
    'experimentalRunAllSpecs': true,
    setupNodeEvents(on, config) {
      coverage(on, config);
      on('file:preprocessor', cucumber());
      getCompareSnapshotsPlugin(on, config);
      return config;
    }
  }
});
