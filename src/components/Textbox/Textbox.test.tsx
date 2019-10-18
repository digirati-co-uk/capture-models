import * as React from 'react';
import { Textbox } from './Textbox';
import { createRenderer } from 'react-test-renderer/shallow';

describe('Textbox', () => {
  test('simple test', () => {
    const renderer = createRenderer();
    renderer.render(<Textbox>Some sample text</Textbox>);

    expect(renderer.getRenderOutput().props).toEqual({
      children: 'Some sample text',
      className: 'textbox',
    });
  });
});
