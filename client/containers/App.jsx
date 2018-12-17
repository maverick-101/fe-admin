import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from "axios";
import Cookie from 'js-cookie';
import Header from './Header';
import SideNav from './SideNav';
import * as types from '../types'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
      displayLoading: true,
      displayMessage: 'Loading User Data...'
    }
  }

  componentWillMount(){
    let token = Cookie.get('saadi_admin_access_token');
    if(token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axios.get('/api/user/me')
      .then(response => {
        //console.log("#### success", response.data);
        this.props.dispatch({
          type: types.SET_USER_FROM_TOKEN,
          payload: response.data
        });
        this.setState({ user: response.data, loading: false});
      })
      .catch(error => {
        //console.log("#### error", error);
        this.setState({ loading: false});
        // this.props.router.push("/login");
      });
    } else {
      this.setState({ loading: false});
      // this.props.router.push("/login");
    }
  }

  render() {
    return (
      !this.state.loading ?
        <div className="container-fluid">
          <Header></Header>
          <SideNav user={this.state.user} router={this.props.router}></SideNav>
          {this.props.children}
        </div> :
        <h2 style={{textAlign: 'center'}}>
          {this.state.displayLoading ?
            <i className="fa fa-circle-o-notch fa-spin" style={{marginRight: '10px'}}></i>
            : null
          }
          {this.state.displayMessage}
        </h2>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(App);
