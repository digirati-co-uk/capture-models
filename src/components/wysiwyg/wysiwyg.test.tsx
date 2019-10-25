import * as React from 'react';
import { WYSIWYG } from './wysiwyg';
import { EditorState } from 'draft-js';
import { createRenderer } from 'react-test-renderer/shallow';

describe('WYSIWYG', () => {
  test('simple test', () => {
    const renderer = createRenderer();
    renderer.render(
      <WYSIWYG Value={EditorState.createEmpty()} OnChange={() => {}} />
    );
  });
});
