// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('preserveCookies', () => {
  Cypress.Cookies.defaults({
    preserve: cookie => {
      return true;
    },
  });
});

Cypress.Commands.add('apiRequest', (request, scope, cb) => {
  return cy
    .task('get-token', {
      scope: scope || ['models.admin', 'site.admin'],
      site: { id: 1, name: 'Test site' },
      user: { id: 2, name: 'Test user' },
      expiresIn: 24 * 60 * 60 * 365,
    })
    .then(token => {
      const requestData = typeof request === 'string' ? { url: request, method: 'get' } : request;

      return cy.request({
        ...requestData,
        auth: {
          bearer: token,
        },
      });
    });
});

Cypress.Commands.add('removeModel', fixtureName => {
  cy.fixture(fixtureName).then(fixture => {
    cy.apiRequest({
      url: `/api/crowdsourcing/model/${fixture.id}`,
      method: 'delete',
    });
  });
});

Cypress.Commands.add('loadFixture', fixtureName => {
  return cy.fixture(fixtureName).then(fixture => {
    cy.log('Loading fixture');
    return cy
      .task('get-token', {
        scope: ['models.admin', 'site.admin'],
        site: { id: 1, name: 'Test site' },
        user: { id: 2, name: 'Test user' },
        expiresIn: 24 * 60 * 60 * 365,
      })
      .then(async token => {
        cy.request({
          url: `/api/crowdsourcing/model/${fixture.id}`,
          method: 'delete',
          auth: {
            bearer: token,
          },
        });

        cy.request({
          url: '/api/crowdsourcing/model',
          method: 'post',
          body: fixture,
          auth: {
            bearer: token,
          },
        });
      });
  });
});
