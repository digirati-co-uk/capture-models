/**
 * @jest-environment node
 */

describe('Editor SSR', () => {
  test('server side loading', () => {
    expect(() => {
      require('../dist/umd/@capture-models/editor');
      // require('../dist/assets/app');
    }).not.toThrow();
  });
});
