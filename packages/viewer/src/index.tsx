import React from 'react';
import { render } from 'react-dom';
import { defaultTheme } from '@capture-models/editor';
import { ThemeProvider } from 'styled-components';
import { RootExamples } from './RootExamples';
import './layout.scss';

render(
  <ThemeProvider theme={defaultTheme}>
    <RootExamples />
  </ThemeProvider>,
  document.getElementById('root')
);
