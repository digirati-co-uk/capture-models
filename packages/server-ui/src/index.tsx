import React from 'react';
import { render } from 'react-dom';
import { defaultTheme } from '@capture-models/editor';
import 'semantic-ui-css/semantic.min.css';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import { UserProvider } from './utility/user-context';
import './layout.scss';

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
