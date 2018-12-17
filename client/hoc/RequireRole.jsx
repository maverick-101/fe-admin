import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import propTypes from 'prop-types';

export class RequireRoleBase extends Component {
  static propTypes = {
    currentUserRole: propTypes.string.isRequired,
    requiredRole: propTypes.array,
    currentUserDepartment: propTypes.string.isRequired,
    requiredDepartment: propTypes.array,
    superAdmin: propTypes.bool.isRequired
  };

  ensureAuth(props) {
    if (!this.hasRequiredRole(props) &&
      (props.currentUserRole !== "nobody" && props.currentUserDepartment !== 'noDepartment') &&
      browserHistory.getCurrentLocation().pathname !== '/dashboard') {
      // send to department dashboard page
      browserHistory.push('/dashboard');
    }
    return true;
  }

  hasRequiredRole({ requiredRole, currentUserRole, requiredDepartment, currentUserDepartment, superAdmin }) {
    return superAdmin || !requiredRole || !requiredDepartment ||
      (requiredRole.indexOf(currentUserRole) >= 0 && requiredDepartment.indexOf(currentUserDepartment) >= 0);
  }

  componentWillReceiveProps(props) {
    this.ensureAuth(props);
  }

  componentDidMount() {
    this.ensureAuth(this.props);
  }

  render() {
    const { children } = this.props;
    if (!this.hasRequiredRole(this.props)) {
      // don't accidentally render anything
      return null;
    }
    return <Fragment>{children}</Fragment>;
  }
}

const mapStateToProps = state => {
  const user = state.user || {};
  return {
    currentUserRole: user.user && user.user.role ? user.user.role : 'nobody',
    currentUserDepartment: user.user && user.user.department ? user.user.department : 'noDepartment',
    superAdmin: user.user && user.user.superadmin ? user.user.superadmin : false
  };
};

const RequireRoleConnected = connect(mapStateToProps)(RequireRoleBase);
export const RequireRole = (WrappedComponent, requireRoleProps = {}) => {
  return function (props) {
    return (
      <RequireRoleConnected {...requireRoleProps}>
        <WrappedComponent {...props} />
      </RequireRoleConnected>
    );
  };
};
