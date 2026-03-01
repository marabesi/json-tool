const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require('cypress');
const coverage = require('@cypress/code-coverage/task');
const { installPlugin } = require('@chromatic-com/cypress');

module.exports = defineConfig({
  viewportHeight: 920,
  viewportWidth: 1280,
  experimentalFastVisibility: true,
  e2e: {
    'projectId': 'wpcwmv',
    'watchForFileChanges': false,
    'specPattern': [
      'cypress/e2e/**/*.feature',
      //'cypress/regression/**/*.spec.js'
    ],
    'experimentalRunAllSpecs': true,
    setupNodeEvents(on, config) {
      if (process.env.ELECTRON_EXTRA_LAUNCH_ARGS) {
        on('task', {
          prepareArchives: () => {
            // Your task logic here (e.g., file operations, cleanup, etc.)
            console.log('Preparing archives...');
            return null; // or return a value if needed
          },
        });
        installPlugin(on, config);
      }
      coverage(on, config);
      on('file:preprocessor', cucumber());
      return config;
    }
  }
});
