import React from 'react';
import { render } from 'react-dom';
import { CardButton } from '@capture-models/editor';

render(
  <div>
    Hello World
    <CardButton>Button</CardButton>
  </div>,
  document.getElementById('root')
);
