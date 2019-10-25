import * as React from 'react';
import { TextArea } from './TextArea';
import { createRenderer } from 'react-test-renderer/shallow';

describe('TextArea', () => {
  test('simple test', () => {
    const renderer = createRenderer();
    renderer.render(<TextArea Text={'Some sample text'} OnChange={() => {}} />);
    expect(renderer.getRenderOutput().props).toEqual({
      children: 'Some sample text',
      className: 'text-area',
    });
  });
});
