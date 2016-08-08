import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import App from './containers/App';
import HomePage from './containers/HomePage';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/home" />
    <Route path="home" component={HomePage}/>
  </Route>
);
