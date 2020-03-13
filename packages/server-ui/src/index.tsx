import React from 'react';
import { render } from 'react-dom';
import { defaultTheme } from '@capture-models/editor';
import 'semantic-ui-css/semantic.min.css';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import { UserProvider } from './utility/user-context';
import './layout.scss';
import './refinements/read-only';
import './refinements/single-field-instance';
import './refinements/inline-field-instance';
import './refinements/basic-unnesting';
import './refinements/tabbed-navigation';
import './refinements/single-choice';

render(
  <ThemeProvider theme={defaultTheme}>
    <UserProvider>
      <Router basename={process.env.BASE_PATH}>
        <App />
      </Router>
    </UserProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
