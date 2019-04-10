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
        user: {
          first_name: '',
          last_name: '',
          city_id: '',
          email: '',
          phone: '',
          password: '',
          address: '',
        },
      username: '',
      password: '',
      loading: false,
    };
    this.endPoint = 'https://api.saaditrips.com';
  }

  componentDidMount() {
    const { history } = this.props;
    const token = Cookie.get('saadi_admin_access_token');
    if (token) {
      history.push('/');
    }
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;

    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }

  postUser = (event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, user, profile_picture } = this.state;
    if (!loading) {
        const fd = new FormData();
        if(profile_picture) {
        fd.append('profile_picture', profile_picture);
        }
        fd.append('user', JSON.stringify(user));

        this.setState({ loading: true });
          axios.post(`${this.endPoint}/api/user/save`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
              window.location.replace('/login')
            } else {
              window.alert('ERROR: User Already Exists')
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR: User Already Exists')
            this.setState({ loading: false });
          })
    }
  }

  render() {
    const { loading, user } = this.state;
    return (
      <div  style={{backgroundColor: 'lightgrey'}} className="app flex-row align-items-center animated fadeIn">
      <div className="container">
      <div className="text-center px-5">
        <img style={{padding: '50px'}} src={require('../client/static/Saadi.png')} />

      <div style={{backgroundColor: '#172a53', padding: '20px'}} className="col">
        <h1 style={{color: 'white'}}>Sign Up</h1>
      <form
        id="login-form"
        data-parsley-validate
        className="form-horizontal form-label-right"
        onSubmit={this.postUser}
      >
        <div className="form-group row">
                      <label
                        className="control-label col-md-4 col-sm-4 text-right"
                        style={{color: 'white'}}
                      >First Name
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          required
                          type="text"
                          name="first_name"
                          className="form-control"
                          value={user.first_name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-4 col-sm-3 text-right"
                        style={{color: 'white'}}
                      >Last Name
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          required
                          type="text"
                          name="last_name"
                          className="form-control"
                          value={user.last_name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                          <label className="control-label col-md-4col-sm-3">City</label>
                          <div className="col-md-4 col-sm-4">
                            <Select
                              name="city_id"
                              value={city}
                              onChange={value => this.setCity(value)}
                              options={cities}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                              required
                            />
                          </div>
                        </div> */}

                    <div className="form-group row">
                      <label
                        className="control-label col-md-4 col-sm-3 text-right"
                        style={{color: 'white'}}
                      >Email
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          required
                          type="text"
                          name="email"
                          className="form-control"
                          value={user.email}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-4 col-sm-3 text-right"
                        style={{color: 'white'}}
                      >Password
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          required
                          type="password"
                          name="password"
                          className="form-control"
                          value={user.password}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label style={{color: 'white'}} className="control-label col-md-4 col-sm-3 text-right">Profile Picture</label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="file"
                          name="profile_picture"
                          className="form-control"
                          onChange={this.handleFile}
                          // required
                          // required={coverForm.url ? 0 : 1}
                        />
                      </div>
                    </div>

                    {user.profile_picture
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-4 col-sm-3 text-right" style={{color: 'white'}}></label>
                        <div className="col-md-4 col-sm-4">
                          <img
                          style={{marginRight: '5px'}}
                          width="100"
                          className="img-fluid"
                          src={`${user.profile_picture.url}`}
                          alt="profile_picture"
                        />
                          
                        </div>
                      </div>
                      ) : null
                              }

                    <div className="form-group row">
                      <label
                        className="control-label col-md-4 col-sm-3 text-right"
                        style={{color: 'white'}}
                      >Phone
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          required
                          type="number"
                          name="phone"
                          className="form-control"
                          value={user.phone}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-4 col-sm-3 text-right"
                        style={{color: 'white'}}
                      >Address
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          required
                          type="text"
                          name="address"
                          className="form-control"
                          value={user.address}
                          onChange={this.handleInputChange}
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
        </form>
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


