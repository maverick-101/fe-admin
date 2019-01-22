import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class PackageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pckg: {
        name: '',
        city_id: '',
        agent_id: '',
        location_id: '',
        price: [],
        travel_modes: [],
        activities: [],
        food: [],
        latitude: '',
        longitude: '',
        rating: '',
        description: '',
      },
      price: {
          person: 0,
          packege_title: '',
          wifi: true,
          shuttle_service: true,
          breakfast: true,
          buffet: true,
          dinner: true,
          nights_stay: 0,
          price: 0,
          description: '',
        },
      travelModes: {
          route: 1,
          departure: "",
          destination: "",
          travel_time: "",
          distance: "",
          travel_type: "",
          description : "",
        },
      activities: {
        activity_type: "",
        description: "",
        status: true,
        },
      food: {
        food_type: '',
        description: "",
        start_time: "",
        end_time: "",
        items: []
        },
      activitiesCount: 1,
      foodsCount: 1,
      priceCount: 1,
      travelModesCount: 1,
      gallery: '',
      city: '',
      cities: [],
      agents: [],
      locations: [],
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postArea = this.postArea.bind(this);
  }

  componentWillMount() {
    this.getCity();
    this.getAgent();
    this.getLocation();
  }

  getCity = () => {
    axios.get(`${this.endPoint}/api/city/fetch`)
        .then((response) => {
          this.setState({
            cities: response.data,
          });
        });
  }

  getAgent = () => {
    axios.get(`${this.endPoint}/api/agentPage/fetch`)
        .then((response) => {
          this.setState({
            agents: response.data,
          });
        });
  }

  getLocation = () => {
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
            pckg: response.data[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          }, () => {
            axios.get(`/api/city/fetchById/${this.state.pckg.city_id}`)
            .then((response) => {
              this.setState({
                city: response.data[0],
              });
            });
          });
        });
      }

  setDescription(description) {
    const { pckg } = this.state;
    pckg.description = description.toString('html');
    this.setState({
      pckg,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { pckg } = this.state;
    pckg[name] = value;
    this.setState({ pckg });
  }

  handleTravelMode = (event) => {
    const { value, name } = event.target;

    const { travelModes } = this.state;
    travelModes[name] = value;
    this.setState(prevState => ({ 
      travelModes,
      pckg: {
        ...prevState.pckg,
        travel_modes: [this.state.travelModes],
      },
     }));
  }

  handleActivities = (event) => {
    const { value, name } = event.target;

    const { activities } = this.state;
    activities[name] = value;
    this.setState(prevState => ({ 
      activities,
      pckg: {
        ...prevState.pckg,
        activities: [this.state.activities],
      },
     }));
  }

  handlePrice = (event) => {
    const { value, name } = event.target;

    const { price } = this.state;
    price[name] = value;
    this.setState(prevState => ({ 
      price,
      pckg: {
        ...prevState.pckg,
        price: [this.state.price],
      },
     }));
  }

  handleFood = (event) => {
    const { value, name } = event.target;

    const { food } = this.state;
    food[name] = value;
    this.setState(prevState => ({ 
      food,
      pckg: {
        ...prevState.pckg,
        food: [this.state.food],
      },
     }));
  }
  

  // handleFile = (event) => {
  //   this.setState({
  //     files: event.target.files.length ? event.target.files[0] : '',
  //   });
  // }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      pckg: {
        ...prevState.pckg,
        city_id: selectedCity.ID,
      },
    }));
  }

  setAgent(selectedAgent) {
    this.setState(prevState => ({
      agent: selectedAgent,
      pckg: {
        ...prevState.pckg,
        agent_id: selectedAgent.ID,
      },
    }));
  }

  setLocation(selectedLocation) {
    this.setState(prevState => ({
      location: selectedLocation,
      pckg: {
        ...prevState.pckg,
        location_id: selectedLocation.ID,
      },
    }));
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postArea(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, pckg, gallery } = this.state;
    if (!loading) {
        this.setState({ loading: true });

        let imgArray = [];
        const fd = new FormData();
        for (let index = 0; index < gallery.length; index += 1) {
          imgArray.push(gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('gallery', img);
          return img;
        });
        fd.append('packagePage', JSON.stringify(pckg));

        if(this.props.params.areaId) {
          // axios.patch('/api/locations/update', fd)
          axios.patch(`${this.endPoint}/api/packagePage/update`, fd)
          .then((response) => {
            if (response.data === 'Package Updated!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        } else {
          axios.post(`${this.endPoint}/api/packagePage/save`, fd)
          .then((response) => {
            if (response.data === 'Package Saved!') {
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
      pckg,
      cities,
      city,
      agents,
      agent,
      locations,
      location,
      description,
      price,
      activities,
      food,
      travelModes,
      activitiesCount,
      foodsCount,
      priceCount,
      travelModesCount,
    } = this.state;
    const toolbarConfig = {
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

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          <div className="col-md-2 col-sm-2">
          
            </div>
            <div className="col-md-10 col-sm-10">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Package Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postArea}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Package Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={pckg.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">Agent</label>
                          <div className="col-md-6 col-sm-6">
                            <Select
                              name="agent_id"
                              value={agent}
                              onChange={value => this.setAgent(value)}
                              options={agents}
                              valueKey="id"
                              labelKey="name"
                              clearable={false}
                              backspaceRemoves={false}
                              required
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
                              name="agent_id"
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
                      >Price
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="price"
                          className="form-control"
                          value={price.price}
                          onChange={this.handlePrice}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Travel Modes
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="distance"
                          className="form-control"
                          value={travelModes.distance}
                          onChange={this.handleTravelMode}
                        />
                      </div>
                    </div>

                    <div className="row" style={{backgroundColor: '#E8E8E8', margin: '10px'}}>
                        <div className="control-label col-md-3 col-sm-3"></div>
                          <div className="col-md-8 col-sm-8">
                            <h3>Activities Details</h3>
                        </div>
                        
                        {/* <div className="control-label col-md-3 col-sm-3"></div>
                      <div className="col-md-6 col-sm-6"> */}
                      {[...Array(activitiesCount)].map((event, index) => {
                        return <div key={index}>
                    <div className="form-group row">
                    {index >=1 ? <hr style={{borderTop: '1px solid gray'}}/> : null}
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Activities Type
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="activities_type"
                          className="form-control"
                          value={activities.activities_type}
                          onChange={this.handleactivities}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Primary</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="primary"
                          value={activities.primary}
                          className="form-control custom-select"
                          onChange={this.handleactivities}
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
                          value={activities.street}
                          onChange={this.handleactivities}
                        />
                      </div>
                    </div>
                  </div>
                    })}
                    <div>
                      <button type="button" style={{marginRight: '5px'}} onClick={() => {this.setState({activitiesCount: activitiesCount + 1})}} className="btn btn-info btn-sm">Add activities</button>
                      <button type="button" onClick={() => {this.setState({activitiesCount: activitiesCount > 1 ? activitiesCount - 1 : activitiesCount})}} className={`btn btn-danger btn-sm ${activitiesCount === 1 ? 'disabled' : ''}`}>Remove activitiy</button>
                    </div>
                </div>

                <div className="row" style={{backgroundColor: '#E8E8E8', margin: '10px'}}>
                        <div className="control-label col-md-3 col-sm-3"></div>
                          <div className="col-md-8 col-sm-8">
                            <h3>Food Details</h3>
                        </div>
                      
                        
                        {/* <div className="control-label col-md-3 col-sm-3"></div>
                      <div className="col-md-6 col-sm-6"> */}
                      {[...Array(foodsCount)].map((event, index) => {
                        return <div key={index}>
                    <div className="form-group row">
                    <div>
                    {index >= 1 ? <hr style={{borderTop: '1px solid gray'}}/> : null}
                    </div>
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Food Type
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="food_type"
                          className="form-control"
                          value={food.food_type}
                          onChange={this.handlefood}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Primary</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="primary"
                          value={food.primary}
                          className="form-control custom-select"
                          onChange={this.handlefood}
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
                          value={food.street}
                          onChange={this.handlefood}
                        />
                      </div>
                    </div>
                  </div>
                    })}
                    <div>
                      <button type="button" style={{marginRight: '5px'}} onClick={() => {this.setState({foodsCount: foodsCount + 1})}} className="btn btn-info btn-sm">Add food item</button>
                      <button type="button" onClick={() => {this.setState({foodsCount: foodsCount > 1 ? foodsCount - 1 : foodsCount})}} className={`btn btn-danger btn-sm ${foodsCount === 1 ? 'disabled' : ''}`}>Remove food item</button>
                    </div>
                </div>

                <div className="row" style={{backgroundColor: '#E8E8E8', margin: '10px'}}>
                        <div className="control-label col-md-3 col-sm-3"></div>
                          <div className="col-md-8 col-sm-8">
                            <h3>Price Details</h3>
                        </div>
                      
                        
                        {/* <div className="control-label col-md-3 col-sm-3"></div>
                      <div className="col-md-6 col-sm-6"> */}
                      {[...Array(priceCount)].map((event, index) => {
                        return <div key={index}>
                    <div className="form-group row">
                    {index >= 1 ? <hr style={{borderTop: '1px solid gray'}}/> : null}
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Price Type
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="price_type"
                          className="form-control"
                          value={price.price_type}
                          onChange={this.handleprice}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Primary</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="primary"
                          value={price.primary}
                          className="form-control custom-select"
                          onChange={this.handleprice}
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
                          value={price.street}
                          onChange={this.handleprice}
                        />
                      </div>
                    </div>
                  </div>
                    })}
                    
                    <div>
                      <button type="button" style={{marginRight: '5px'}} onClick={() => {this.setState({priceCount: priceCount + 1})}} className="btn btn-info btn-sm">Add another Price</button>
                      <button type="button" onClick={() => {this.setState({priceCount: priceCount > 1 ? priceCount - 1 : priceCount})}} className={`btn btn-danger btn-sm ${priceCount === 1 ? 'disabled' : ''}`}>Remove price</button>
                    </div>
                </div>

                    <div className="row" style={{backgroundColor: '#E8E8E8', margin: '10px'}}>
                        <div className="control-label col-md-3 col-sm-3"></div>
                          <div className="col-md-8 col-sm-8">
                            <h3>Travel Mode Details</h3>
                        </div>
                      
                        
                        {/* <div className="control-label col-md-3 col-sm-3"></div>
                      <div className="col-md-6 col-sm-6"> */}
                      {[...Array(travelModesCount)].map((event, index) => {
                        return <div key={index}>
                    <div className="form-group row">
                    {index >= 1 ? <hr style={{borderTop: '1px solid gray'}}/> : null}
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Travel Mode Type
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="travelModes_type"
                          className="form-control"
                          value={travelModes.travelModes_type}
                          onChange={this.handletravelModes}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Primary</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="primary"
                          value={travelModes.primary}
                          className="form-control custom-select"
                          onChange={this.handletravelModes}
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
                          value={travelModes.street}
                          onChange={this.handletravelModes}
                        />
                      </div>
                    </div>
                  </div>
                    })}
                    
                    <div>
                      <button type="button" style={{marginRight: '5px'}} onClick={() => {this.setState({travelModesCount: travelModesCount + 1})}} className="btn btn-info btn-sm">Add Travel Modes item</button>
                      <button type="button" onClick={() => {this.setState({travelModesCount: travelModesCount > 1 ? travelModesCount - 1 : travelModesCount})}} className={`btn btn-danger btn-sm ${travelModesCount === 1 ? 'disabled' : ''}`}>Remove Travel Mode item</button>
                    </div>
                </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >latitude
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="latitude"
                          className="form-control"
                          value={pckg.latitude}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Longitude
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="longitude"
                          className="form-control"
                          value={pckg.longitude}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Rating
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="rating"
                          className="form-control"
                          value={pckg.rating}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Location Gallery</label>
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
                          value={pckg.image_type}
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
