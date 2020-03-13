import React from 'react';
import { render } from 'react-dom';
import { defaultTheme } from '@capture-models/editor';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import { UserProvider } from './utility/user-context';
import './layout.scss';
import './refinements/filter-revises-field';
import './refinements/no-model-fields';
import './refinements/read-only';
import './refinements/single-field-instance';
import './refinements/inline-field-instance';
import './refinements/basic-unnesting';
import './refinements/tabbed-navigation';
import './refinements/single-choice';
import './refinements/hide-empty-structure-revisions';

render(
  <ThemeProvider theme={defaultTheme}>
    <UserProvider>
      <Router basename="/crowdsourcing-editor">
        <App />
      </Router>
    </UserProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
