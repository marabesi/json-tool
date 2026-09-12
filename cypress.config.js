const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require('cypress');
const coverage = require('@cypress/code-coverage/task');
const { installPlugin } = require('@chromatic-com/cypress');

module.exports = defineConfig({
  viewportHeight: 920,
  viewportWidth: 1280,
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

      on('task', {
        prepareArchives: () => null,
      });

      if (process.env.CI) {
        installPlugin(on, config);
      }
      return config;
    }
  }
});
