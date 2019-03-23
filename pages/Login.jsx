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
      // user: null,
      username: '',
      password: '',
      loading: false,
    };

    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    const { history } = this.props;
    const token = Cookie.get('graana_admin_access_token');
    if (token) {
      history.push('/');
    }
  }

  submit() {
    const { history } = this.props;
    const { loading } = this.state;
    if (!loading) {
      const { username, password } = this.state;
      const user = {
        email: username,
        password,
      };
      this.setState({ loading: true });
      axios.post('/api/user/system-user-login', user)
        .then((response) => {
          // console.log("####", response);
          if (response && response.status === 200) {
            const { token } = response.data;
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            Cookie.set('graana_admin_access_token', `${token}`, { expires: 14 });
            history.push('/');
            // window.location.href = ('/');
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          window.alert(error.response.data);
        });
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="app flex-row align-items-center animated fadeIn">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <Formsy onValidSubmit={this.submit}>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="email"
                          placeholder="Username"
                          required
                          ref={(input) => {
                            this.username = input;
                          }}
                          onChange={e => this.setState({ username: e.target.value })}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          required
                          ref={(input) => {
                            this.password = input;
                          }}
                          onChange={e => this.setState({ password: e.target.value })}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="#172a53"
                            className={`px-4 ${loading ? 'disabled' : ''}`}
                          >
                            <i
                              className={`fa fa-spinner fa-pulse ${loading ? '' : 'd-none'}`}
                            /> Login
                          </Button>
                        </Col>
                        {/* <Col xs="6" className="text-right">
                         <Button color="link" className="px-0">Forgot password?</Button>
                         </Col> */}
                      </Row>
                    </Formsy>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-graana-red py-5 d-md-down-none"
                  style={{ width: `${44}%` }}
                >
                  <CardBody className="text-center">
                    <div>
                      <div style={style.logoWrapper}>
                        <svg style={style.svg}>
                          <use xlinkHref="/img/logo.svg#logo" />
                        </svg>
                      </div>
                      <p
                        className="text-right"
                        style={{
                          width: `${70}%`,
                          margin: '0 auto',
                        }}
                      >SAADI TRIPS
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(connect()(Login));
