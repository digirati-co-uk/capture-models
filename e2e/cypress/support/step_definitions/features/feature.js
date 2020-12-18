import init from 'picklejs/cypress';
import generateAutoPhrases from 'picklejs/cypress';

import { setScreens, setElementSelector, SCREENS } from 'picklejs/common/variables';

import selectors from './selectors.json';
import screens from './screens.json';
import { REDIRECTED_TO, ON_PAGE } from 'picklejs/common/regex';

// Fix bug with equality.
const redirectedTo = (screen) => {
  cy.url().should('eq', Cypress.config().baseUrl + SCREENS[screen]);
};
Then(REDIRECTED_TO, redirectedTo);
Then(ON_PAGE, redirectedTo);

/*
 Examples of new step definitions

    Given('I am using the {string} something', (name) => {
      // code to execute.
    });

    When('I view task with id {string}', (taskId) => {
      // code to execute.
    });

    Then('I should be ...', () => {
      // code to execute.
    });
 */

generateAutoPhrases();
setScreens(screens);
setElementSelector(selectors);

init();
