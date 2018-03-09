import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, Link} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Menu from './components/Global/Menu.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <Router history = {hashHistory}>
      <Route path = "/" component = {Menu} />
    </Router>
  </MuiThemeProvider>,
  document.getElementById('app')
);
