// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
const createSignedToken = require('../utility/create-signed-token');
const { initPlugin } = require('cypress-plugin-snapshots/plugin');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
module.exports = (on, config) => {
  initPlugin(on, config);

  on('task', {
    async 'example:load:fixture'() {
      // Code for fixture here...
      // Called using cy.task('example:load:fixture', fixture);
    },
    async 'get-token'(user) {
      return await createSignedToken(user);
    },
  });

  return config;
};
