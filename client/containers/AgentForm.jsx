import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { API_END_POINT } from '../../config';

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
      address: [{
        address_type: '',
        primary: true,
        location_id: 0,
        city_id: 0,
        street: ''
      }],
      gallery: '',
      addressCity: '',
      agentCity: '',
      cities: [],
      addressLocation: '',
      agentLocation: '',
      locations: [],
      addressCount: 1,
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postAgent = this.postAgent.bind(this);
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/fetch/city-fetch`)
        .then((response) => {
          this.setState({
            cities: response.data,
          });
        });
    axios.get(`${API_END_POINT}/api/fetch/locations-fetch`)
    .then((response) => {
      this.setState({
        locations: response.data,
      });
    });
  }

  componentDidMount() {
    console.log('props',this.props);
    const { match } = this.props;
      if (match.params.agentId)
      axios.get(`${API_END_POINT}/api/fetchById/agentPage-fetchById/${match.params.agentId}`)
        .then((response) => {
          this.setState({
            agent: response.data[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          }, () => {
            axios.get(`${API_END_POINT}/api/fetchById/city-fetchById/${this.state.agent.city_id}`)
            .then((response) => {
              this.setState({
                agentCity: response.data[0],
              }, () => {
                axios.get(`${API_END_POINT}/api/fetchById/location-fetchById/${this.state.agent.location_id}`)
                .then((response) => {
                  this.setState({
                    agentLocation: response.data[0]
                  })
                })
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

  handleAddress = (event, index) => {
    const { value, name } = event.target;

    const { address } = this.state;
    address[index][name] = value;
    this.setState(prevState => ({ 
      address,
      agent: {
        ...prevState.agent,
        addresses: this.state.address,
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

  setCity(selectedCity, fnCaller) {
    if(fnCaller === 'agent') {
      this.setState(prevState => ({
        agentCity: selectedCity,
        agent: {...prevState.agent, city_id: selectedCity.ID},
      }));
    } else {
      this.setState(prevState => ({
        addressCity: selectedCity,
        address: {
          ...prevState.address,
          city_id: selectedCity.ID,
        },
      }));
    }
  }

  setLocation(selectedLocation, fnCaller) {
    if(fnCaller === 'agent') {
    this.setState(prevState => ({
      agentLocation: selectedLocation,
      agent: {
        ...prevState.agent,
        location_id: selectedLocation.ID,
      },
    }));
  } else {
    this.setState(prevState => ({
      addressLocation: selectedLocation,
      address: {
        ...prevState.address,
        location_id: selectedLocation.ID,
      },
    }));
  }
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

        if(match.params.agentId) {
          axios.patch(`${API_END_POINT}/api/update/agentPage-update`, fd)
          .then((response) => {
            if (response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        } else {
          axios.post(`${API_END_POINT}/api/save/agentPage-save`, fd)
          .then((response) => {
            if (response.status === 200) {
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
      addressCity,
      agentCity,
      locations,
      addressLocation,
      agentLocation,
      address,
      description,
      addressCount
    } = this.state;
    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
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
          label: 'Large Heading',
          style: 'header-three',
        },
        {
          label: 'Medium Heading',
          style: 'header-four',
        },
        {
          label: 'Small Heading',
          style: 'header-five',
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
                              value={agentCity}
                              onChange={value => this.setCity(value, 'agent')}
                              options={cities}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                              required
                            />
                          </div>
                        </div>

                    {/* <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">Location</label>
                          <div className="col-md-6 col-sm-6">
                            <Select
                              name="location_id"
                              value={agentLocation}
                              onChange={value => this.setLocation(value, 'agent')}
                              options={locations}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                              required
                            />
                          </div>
                        </div> */}

                      <div className="row" style={{backgroundColor: '#E8E8E8', margin: '10px'}}>
                        <div className="control-label col-md-3 col-sm-3"></div>
                          <div className="col-md-8 col-sm-8">
                            <h3>Address Details</h3>
                        </div>
                      
                      {[...Array(addressCount)].map((event, index) => {
                        return <div key={index}>
                    <div className="form-group row">
                    {index >=1 ? <hr style={{borderTop: '1px solid gray'}}/> : null}
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Address Type
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          // required
                          type="text"
                          name="address_type"
                          className="form-control"
                          value={address.address_type}
                          onChange={(event) => this.handleAddress(event, index)}
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
                          onChange={(event) => this.handleAddress(event, index)}
                          // required
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
                              value={addressCity}
                              onChange={value => this.setCity(value, 'address')}
                              options={cities}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                              // required
                            />
                          </div>
                        </div>

                    <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">Location</label>
                          <div className="col-md-6 col-sm-6">
                            <Select
                              name="location_id"
                              value={addressLocation}
                              onChange={value => this.setLocation(value, 'address')}
                              options={locations}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                              // required
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
                          // required
                          type="text"
                          name="street"
                          className="form-control"
                          onChange={(event) => this.handleAddress(event, index)}
                          onChange={this.handleAddress}
                        />
                      </div>
                    </div>
                  </div>
                    })}
                    <div style={{float: "right"}}>
                      <button type="button" style={{marginRight: '5px'}}
                      className="btn btn-info btn-sm"
                      onClick={() => {
                        this.setState({
                          addressCount: addressCount + 1,
                          address: [...address, {address_type: "", primary: true, location_id: 0, city_id: 0, street: ''}]})
                        }}> Add Address
                        </button>
                      <button type="button" onClick={() => {this.setState({addressCount: addressCount > 1 ? addressCount - 1 : addressCount})}} className={`btn btn-danger btn-sm ${addressCount === 1 ? 'disabled' : ''}`}>Remove Address</button>
                    </div>
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
                          required={agent.gallery ? 0 : 1}
                        />
                      </div>
                    </div>

                    {agent.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {agent.gallery.map((image,index) => {
                          return (
                          <img key={index}
                          style={{marginRight: '5px'}}
                          width="100"
                          className="img-fluid"
                          src={`${image.url}`}
                          alt="cover"
                        />
                          )
                        })}
                          
                        </div>
                      </div>
                      ) : null
                              }

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
