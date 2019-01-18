import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';

export default class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        description: '',
        password: '',
        address: '',

      },
      userId: '',
      profile_picture: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postUser = this.postUser.bind(this);
  }

  componentDidMount() {
    console.log('props',this.props);
      if (this.props.params.userId)
      axios.get(`/api/user/fetchById/${this.props.params.userId}`)
        .then((response) => {
          this.setState({
            user: response.data[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          });
        });
    }

  setDescription(description) {
    const { user } = this.state;
    user.description = description.toString('html');
    this.setState({
      user,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }

  postUser(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, user, profile_picture } = this.state;
    if (!loading) {
        const fd = new FormData();
        fd.append('profile_picture', profile_picture);
        fd.append('user', JSON.stringify(user));

        this.setState({ loading: true });
        if(this.props.params.userId) {
          // axios.patch('/api/user/update', fd)
          axios.patch(`${this.endPoint}/api/user/update`, fd)
          .then((response) => {
            if (response.data === 'User Updated!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
        else {
        // axios.post('/api/user/save', fd)
        axios.post(`${this.endPoint}/api/user/save`, fd)
          .then((response) => {
            if (response.data === 'User Saved!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
    }
  }

  handleFile = (event) => {
    this.setState({
      profile_picture: event.target.files.length ? event.target.files[0] : '',
    });
  }

  render() {
    console.log(this.state);
    const {
      loading,
      user,
      description,
    } = this.state;
    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
      INLINE_STYLE_BUTTONS: [
        {
          label: 'Bold',
          style: 'BOLD',
          className: 'custom-css-class',
        },
        {
          label: 'Italic',
          style: 'ITALIC',
        },
        {
          label: 'Underline',
          style: 'UNDERLINE',
        },
      ],
      BLOCK_TYPE_DROPDOWN: [
        {
          label: 'Normal',
          style: 'unstyled',
        },
        {
          label: 'Heading',
          style: 'header-four',
        },
      ],
      BLOCK_TYPE_BUTTONS: [
        {
          label: 'UL',
          style: 'unordered-list-item',
        },
        {
          label: 'OL',
          style: 'ordered-list-item',
        },
      ],
    };
    // console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          <div className="col-md-2 col-sm-2">
          
            </div>
            <div className="col-md-10 col-sm-10">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter User Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postUser}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >First Name
                      </label>
                      <div className="col-md-6 col-sm-6">
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
                        className="control-label col-md-3 col-sm-3"
                      >Last Name
                      </label>
                      <div className="col-md-6 col-sm-6">
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

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Email
                      </label>
                      <div className="col-md-6 col-sm-6">
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
                        className="control-label col-md-3 col-sm-3"
                      >Password
                      </label>
                      <div className="col-md-6 col-sm-6">
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
                      <label className="control-label col-md-3 col-sm-3">Profile Picture</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          name="profile_picture"
                          className="form-control"
                          onChange={this.handleFile}
                          required
                          // required={coverForm.url ? 0 : 1}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Phone
                      </label>
                      <div className="col-md-6 col-sm-6">
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
                        className="control-label col-md-3 col-sm-3"
                      >Address
                      </label>
                      <div className="col-md-6 col-sm-6">
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

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Description</label>
                      <div className="col-md-6 col-sm-6">
                        <RichTextEditor
                          value={description}
                          toolbarConfig={toolbarConfig}
                          onChange={(e) => {
                            this.setDescription(e);
                          }}
                        />
                      </div>
                    </div> */}
                    <div className="ln_solid" />
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
        </div>
      </div>
    );
  }
}

