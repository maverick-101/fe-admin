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
import AreaForm from './containers/AreaForm';
import AreaResource from './containers/AreaResource';

import Cities from './containers/Cities'
import CityForm from './containers/CityForm';

import Hotels from './containers/Hotels';
import HotelForm from './containers/HotelForm';
import HotelResource from './containers/HotelResource';

import Users from './containers/Users';
import UserForm from './containers/UserForm';

import RoomForm from './containers/RoomForm';

import CoverForm from './containers/CoverForm';
import CoverBanner from './containers/CoverBanner';

import AgentForm from './containers/AgentForm';
import Agents from './containers/Agents';

import PackageForm from './containers/PackageForm';
import Packages from './containers/Packages';
import PackageResource from './containers/PackageResource';

import BookingForm from './containers/BookingForm';
import Bookings from './containers/Bookings';

import OrderForm from './containers/OrderForm';
import Orders from './containers/Orders';

import Ratings from './containers/Ratings';
import RatingsForm from './containers/RatingsForm';

import FeaturedPackages from './containers/FeaturedPackages';
import FeaturedHotels from './containers/FeaturedHotels';
import FeaturedForm from './containers/FeaturedForm';

import Experiences from './containers/Experiences';
import ExperienceForm from './containers/ExperienceForm';
import ExperienceResourceForm from './containers/ExperienceResourceForm';
import ExperienceRatingForm from './containers/ExperienceRatingForm';

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
        <Route path="/area_resource/:areaId" component={AreaResource}/>

        <Route path="/cities" component={Cities}/>
        <Route path="/city_form" component={CityForm}/>
        <Route path="/edit_city/:cityId" component={CityForm}/>

        <Route path="/hotels" component={Hotels}/>
        <Route path="/hotel_form" component={HotelForm}/>
        <Route path="/edit_hotel/:hotelId" component={HotelForm}/>
        <Route path="/hotel_resource/:hotelId" component={HotelResource}/>

        <Route path="/users" component={Users}/>
        <Route path="/user_form" component={UserForm}/>
        <Route path="/edit_user/:userId" component={UserForm}/>

        <Route path="/rooms/:hotelId" component={RoomForm}/>
        <Route path="/edit_rooms/:roomId" component={RoomForm}/>

        <Route path="/cover_banner" component={CoverBanner}/>
        <Route path="/cover_banner_form" component={CoverForm}/>
        <Route path="/edit_coverBanner/:coverBannerId" component={CoverForm}/>
        
        <Route path="/agents" component={Agents}/>
        <Route path="/agent_form" component={AgentForm}/>
        <Route path="/edit_agent/:agentId" component={AgentForm}/>

        <Route path="/packages" component={Packages}/>
        <Route path="/package_form" component={PackageForm}/>
        <Route path="/edit_package/:packageId" component={PackageForm}/>
        <Route path="/package_resource_form/:packageId" component={PackageResource}/>

        <Route path="/bookings" component={Bookings}/>
        <Route path="/booking_form" component={BookingForm}/>
        <Route path="/edit_booking/:bookingId" component={BookingForm}/>

        <Route path="/orders" component={Orders}/>
        <Route path="/order_form" component={OrderForm}/>
        <Route path="/edit_order/:orderId" component={OrderForm}/>

        <Route path="/ratings" component={Ratings}/>
        <Route path="/ratings_form" component={RatingsForm}/>

        <Route path="/featured_hotels" component={FeaturedHotels}/>
        <Route path="/featured_hotels_form" component={FeaturedForm}/>
        <Route path="/edit_featured_hotels/:featuredHotelId" component={FeaturedForm}/>

        <Route path="/featured_packages" component={FeaturedPackages}/>
        <Route path="/featured_packages_form" component={FeaturedForm}/>
        <Route path="/edit_featured_packages/:featuredPackageId" component={FeaturedForm}/>

        <Route path="/experiences" component={Experiences}/>
        <Route path="/experiences_form" component={ExperienceForm}/>
        <Route path="/edit_experiences_form/:experienceId" component={ExperienceForm}/>
        <Route path="/experiences_resource_form/:experienceId" component={ExperienceResourceForm}/>
        <Route path="/experiences_rating_form/:experienceId" component={ExperienceRatingForm}/>
        
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
