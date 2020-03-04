import React from 'react';
import { render } from 'react-dom';
import { defaultTheme } from '@capture-models/editor';
import 'semantic-ui-css/semantic.min.css';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import './layout.scss';

render(
  <ThemeProvider theme={defaultTheme}>
    <Router>
      <App />
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
);
