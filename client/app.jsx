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
import Cities from './containers/Cities'
import Stats from './containers/Stats';
import AreaForm from './containers/AreaForm';
import CityForm from './containers/CityForm';
import Hotels from './containers/Hotels';
import HotelForm from './containers/HotelForm';
import Users from './containers/Users';
import UserForm from './containers/UserForm';

import RoomForm from './containers/RoomForm';

import CoverForm from './containers/CoverForm';

const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Stats}/>

        <Route path="/area" component={Area}/>
        <Route path="/area_form" component={AreaForm}/>
        <Route path="/edit_area/:areaId" component={AreaForm}/>

        <Route path="/cities" component={Cities}/>
        <Route path="/city_form" component={CityForm}/>
        <Route path="/edit_city/:cityId" component={CityForm}/>

        <Route path="/hotels" component={Hotels}/>
        <Route path="/hotel_form" component={HotelForm}/>
        <Route path="/edit_hotel/:hotelId" component={HotelForm}/>

        <Route path="/users" component={Users}/>
        <Route path="/user_form" component={UserForm}/>
        <Route path="/edit_user/:userId" component={UserForm}/>

        <Route path="/rooms" component={RoomForm}/>

        <Route path="/cover_banner_form" component={CoverForm}/>

      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
