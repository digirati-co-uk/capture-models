import React from 'react';
import { pluginStore, registerField, resetPluginStore } from './plugins';

describe('plugin store', () => {
  beforeEach(resetPluginStore);

  test('adding field plugin', () => {
    registerField(
      'my-type',
      () => React.createElement('div', {}, ['edit']),
      () => React.createElement('div', {}, ['view'])
    );

    registerField(
      'my-type-2',
      () => React.createElement('div', {}, ['edit']),
      () => React.createElement('div', {}, ['view'])
    );

    expect(pluginStore).toMatchInlineSnapshot(`
      Object {
        "fields": Object {
          "my-type": Object {
            "EditComponent": [Function],
            "ViewComponent": [Function],
            "type": "my-type",
          },
          "my-type-2": Object {
            "EditComponent": [Function],
            "ViewComponent": [Function],
            "type": "my-type-2",
          },
        },
        "selectors": Object {},
      }
    `);
  });
});
