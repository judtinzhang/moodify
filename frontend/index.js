import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import App from './src/App'

import 'antd/dist/antd.css';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/hello" render={() => <App />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
