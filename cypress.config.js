const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://portfolio-ferid.netlify.app/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: 'cypress/support/e2e.js',
  },
  env: {
    ADMIN_USERNAME: 'Ferid',
    ADMIN_PASSWORD: 'Dorian51'
  }
})