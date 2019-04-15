import React, { Component } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';

class Logout extends Component {
  componentWillMount() {
    const { history } = this.props;
    axios.defaults.headers.common.Authorization = '';
    Cookie.remove('graana_admin_access_token');
    history.push('/login');
    // window.location.href = ('/login');
  }

  render() {
    return (
      <div />
    );
  }
}

Logout.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default Logout;
