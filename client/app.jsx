import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dates/lib/css/_datepicker.css';
import 'font-awesome/css/font-awesome.css';
import './dashboard.css'

import App from './containers/App';
import Area from './containers/Area';
import Stats from './containers/Stats';

const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Stats}/>
        <Route path="/area" component={Area}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
