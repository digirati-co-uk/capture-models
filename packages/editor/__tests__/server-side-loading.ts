/**
 * @jest-environment node
 */
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');

describe('Editor SSR', () => {
  test('server side loading', () => {
    expect(() => {
      require('../dist/umd/@capture-models/editor');
      // require('../dist/assets/app');
    }).not.toThrow();
  });
});
