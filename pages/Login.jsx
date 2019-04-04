import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import Cookie from 'js-cookie';
import axios from 'axios';
import Formsy from 'formsy-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

const style = {
  logoWrapper: {
    width: '70%',
    margin: '15px auto 0',
    height: `${100}px`,
  },
  svg: {
    width: '100%',
    fill: '#ffffff',
  },
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // user: null,
      username: '',
      password: '',
      loading: false,
    };
    this.endPoint = 'https://api.saaditrips.com';
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    const token = Cookie.get('saadi_admin_access_token');
    if (token) {
      history.push('/');
    }
  }

  signUp = () => {
    window.location.replace('/signup')
  }

  submit() {
    const { history } = this.props;
    const { loading } = this.state;
    if (!loading) {
      const { username, password } = this.state;
      const user = {email: username, password};
      let requestBody = { 'user' : JSON.stringify(user)};
      this.setState({ loading: true });
      axios.post('/api/user/signIn', requestBody)
        .then((response) => {
          // console.log("####", response);
          if (response && response.status === 200) {
            const { Token } = response.data;
            // window.alert(Token);
            axios.defaults.headers.common.Authorization = `Bearer ${Token}`;
            Cookie.set('saadi_admin_access_token', `${Token}`, { expires: 14 });
            history.push('/');
            // window.location.href = ('/');
          }
        })
        // .catch((error) => {
        //   this.setState({ loading: false });
        //   window.alert(error.response.data);
        // });
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div  style={{backgroundColor: 'lightgrey'}} className="app flex-row align-items-center animated fadeIn">
      <div className="container">
      <div className="text-center px-5">
        <img style={{padding: '50px'}} src={require('../client/static/Saadi.png')} />

      <div style={{backgroundColor: '#172a53', padding: '20px'}} className="col">

      <Formsy onValidSubmit={this.submit}>
        <div className="form-group row">
          <label
            className="control-label col-md-4 col-sm-4 text-right"
            style={{color: 'white'}}
          >Username or Email
          </label>
          <div className="col-md-4 col-sm-4">
            <input
              required
              type="text"
              name="username"
              className="form-control"
              value={this.state.username}
              onChange={e => this.setState({ username: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group row">
          <label
            className="control-label col-md-4 col-sm-4 text-right"
            style={{color: 'white'}}
          >Password
          </label>
          <div className="col-md-4 col-sm-4">
            <input
              required
              type="password"
              name="password"
              className="form-control"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group row">
          <div className="col-md-12 col-sm-12 text-center offset-md-3">
            <Button
              className={`btn btn-success btn-lg ${loading ? 'disabled' : ''}`}
            >
              <i
                className={`fa fa-spinner fa-pulse ${loading ? '' : 'hidden'}`}
              /> Submit
            </Button>
          </div>
        </div>
        <h3 style={{color: 'white'}} onClick={this.signUp}>Dont have an account? Sign Up here!</h3>
        </Formsy>
      </div>

      </div>

      </div>
        
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(connect()(Login));


