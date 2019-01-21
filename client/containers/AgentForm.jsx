import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class AgentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      agent: {
        name: '',
        city_id: '',
        location_id: '',
        addresses: [],
      },
      address: {
        address_type: '',
        primary: true,
        location_id: 0,
        city_id: 0,
        street: ''
      },
      gallery: '',
      city: '',
      cities: [],
      location: '',
      locations: [],
      addressCount: 1,
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postAgent = this.postAgent.bind(this);
  }

  componentWillMount() {
    axios.get(`${this.endPoint}/api/city/fetch`)
        .then((response) => {
          this.setState({
            cities: response.data,
          });
        });
    axios.get(`${this.endPoint}/api/locations/fetch`)
    .then((response) => {
      this.setState({
        locations: response.data,
      });
    });
  }

  componentDidMount() {
    console.log('props',this.props);
      if (this.props.params.areaId)
      axios.get(`/api/locations/fetchById/${this.props.params.areaId}`)
        .then((response) => {
          this.setState({
            agent: response.data[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          }, () => {
            axios.get(`/api/city/fetchById/${this.state.agent.city_id}`)
            .then((response) => {
              this.setState({
                city: response.data[0],
              });
            });
          });
        });
      }

  setDescription(description) {
    const { agent } = this.state;
    agent.description = description.toString('html');
    this.setState({
      agent,
      description,
    });
  }

  handleAddress = (event) => {
    const { value, name } = event.target;

    const { address } = this.state;
    address[name] = value;
    this.setState(prevState => ({ 
      address,
      agent: {
        ...prevState.agent,
        addresses: [this.state.address],
      },
     }));
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { agent } = this.state;
    agent[name] = value;
    this.setState({ agent });
  }

  // handleFile = (event) => {
  //   this.setState({
  //     files: event.target.files.length ? event.target.files[0] : '',
  //   });
  // }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      agent: {
        ...prevState.agent,
        city_id: selectedCity.ID,
      },
    }));
  }

  setLocation(selectedLocation) {
    this.setState(prevState => ({
      location: selectedLocation,
      agent: {
        ...prevState.agent,
        location_id: selectedLocation.ID,
      },
    }));
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postAgent(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, agent, gallery } = this.state;
    if (!loading) {
        this.setState({ loading: true });

        let imgArray = [];
        const fd = new FormData();
        for (let index = 0; index < gallery.length; index += 1) {
          imgArray.push(gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('gallery_images', img);
          return img;
        });
 
        fd.append('agentPage', JSON.stringify(agent));

        if(this.props.params.agentId) {
          axios.patch(`${this.endPoint}/api/agentPage/update`, fd)
          .then((response) => {
            if (response.data === 'AgentPage Updated!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        } else {
          axios.post(`${this.endPoint}/api/agentPage/save`, fd)
          .then((response) => {
            if (response.data === 'AgentPage Saved!') {
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

  render() {
    console.log(this.state)
    const {
      loading,
      agent,
      cities,
      city,
      locations,
      location,
      address,
      description,
      addressCount
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
                  <h2>Enter Agent Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postAgent}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Agent Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={agent.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">City</label>
                          <div className="col-md-6 col-sm-6">
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
                        </div>

                    <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">Location</label>
                          <div className="col-md-6 col-sm-6">
                            <Select
                              name="location_id"
                              value={location}
                              onChange={value => this.setLocation(value)}
                              options={locations}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                              required
                            />
                          </div>
                        </div>

                        <div style={{backgroundColor: 'gainsboro'}}>
                      <h3>Address Details</h3>

                      {[...Array(addressCount)].map((event, index) => {
                        return <div>
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Address Type
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="address_type"
                          className="form-control"
                          value={address.address_type}
                          onChange={this.handleAddress}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Primary</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="primary"
                          value={address.primary}
                          className="form-control custom-select"
                          onChange={this.handleAddress}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">City</label>
                          <div className="col-md-6 col-sm-6">
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
                        </div>

                    <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">Location</label>
                          <div className="col-md-6 col-sm-6">
                            <Select
                              name="location_id"
                              value={location}
                              onChange={value => this.setLocation(value)}
                              options={locations}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                              required
                            />
                          </div>
                        </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Street
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="street"
                          className="form-control"
                          value={address.street}
                          onChange={this.handleAddress}
                        />
                      </div>
                    </div>
                    </div>
                    })}
                  <p>Add another address
                  <button type="button" onClick={() => {this.setState({addressCount: addressCount + 1})}} className="btn btn-info btn-sm">Add</button>
                  </p>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Agent Gallery</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          name="cover"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          // required={coverForm.url ? 0 : 1}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="image_type"
                          value={agent.image_type}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="lounge">Lounge Image</option>
                          <option value="main_hall">Main Hall Image</option>
                        </select>
                      </div>
                    </div> */}

                    <div className="form-group row">
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
                    </div>
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
