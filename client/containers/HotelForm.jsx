import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import _ from 'lodash';

import _amenities from '../static/_amenities';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

const style = {
  amenitiesBox : {
    border: '1px solid #e5e5e5',
    borderRadius: '2px',
    marginBottom: '5px',
  }
}

export default class HotelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hotel: {
        name: '',
        location_id: '',
        city_id: '',
        user_id: '',
        address: '',
        minimum_price: '',
        image_type: '',
        stars: '',
        logo: '',
        url: '',
        pets_allowed: '',
        smoking_allowed: '',
        postalCode: '',
        star_rating: '',
        email: '',
        phone: '',
        latitude: '',
        longitude: '',
        description: '',
        hotel_amenities: [],
      },
      hotel_gallery: '',
      cities: [],
      locations: [],
      users: [],
      city: '',
      location: '',
      user: '',
      showAmenities: false,
      amenities: _amenities.items,
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleFile = this.handleFile.bind(this);
    this.postHotel = this.postHotel.bind(this);
  }

  componentWillMount() {
    axios.get(`${this.endPoint}/api/fetch/city-fetch`)
        .then((response) => {
          this.setState({
            cities: response.data,
          });
        });
    axios.get(`${this.endPoint}/api/fetch/locations-fetch`)
    .then((response) => {
      this.setState({
        locations: response.data,
      });
    });
    axios.get(`${this.endPoint}/api/user/fetch`)
    .then((response) => {
      this.setState({
        users: response.data,
      });
    });
  }

  componentDidMount() {
    console.log('props',this.props);
      if (this.props.params.hotelId)
      axios.get(`${this.endPoint}/api/hotel/fetchById/${this.props.params.hotelId}`)
        .then((response) => {
          this.setState({
            hotel: response.data,
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          }, () => {
            axios.get(`${this.endPoint}/api/fetchById/city-fetchById/${this.state.hotel.city_id}`)
            .then((response) => {
              this.setState({
                city: response.data[0],
              }, () => {
                axios.get(`${this.endPoint}/api/fetchById/location-fetchById/${this.state.hotel.location_id}`)
                .then((response) => {
                  this.setState({
                    location: response.data[0],
                  }, () => {
                    axios.get(`${this.endPoint}/api/user/fetchById/${this.state.hotel.user_id}`)
                    .then((response) => {
                      this.setState({
                        user: response.data[0],
                      })
                    })
                  })
                })
              });
            });
          });
        });
      }

  changeSelection(index) {
    const { amenities } = this.state;
    let headerAmenities= [];
    amenities[index].value = !amenities[index].value;

    amenities.forEach((amenity, index) => {
      headerAmenities.push(_.omit(amenities[index], ['image']))
    })

    this.setState(prevState => ({
      amenities,
      hotel: {
        ...prevState.hotel,
        hotel_amenities: headerAmenities,
      },
    }));
  }

  setDescription(description) {
    const { hotel } = this.state;
    hotel.description = description.toString('html');
    this.setState({
      hotel,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { hotel } = this.state;
    hotel[name] = value;
    this.setState({ hotel });
  }

  // handleFile(event) {
  //   this.setState({
  //     gallery: event.target.files.length ? event.target.files[0] : '',
  //   });
  // }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      hotel: {
        ...prevState.hotel,
        city_id: selectedCity.ID,
      },
    }));
  }

  setLocation(selectedLocation) {
    this.setState(prevState => ({
      location: selectedLocation,
      hotel: {
        ...prevState.hotel,
        location_id: selectedLocation.ID,
      },
    }));
  }

  setUser(selectedUser) {
    this.setState(prevState => ({
      user: selectedUser,
      hotel: {
        ...prevState.hotel,
        user_id: selectedUser.ID,
      },
    }));
  }

  handleImages = (event) => {
    this.setState({ hotel_gallery: event.target.files });
  }

  postHotel(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, hotel, hotel_gallery } = this.state;
    if (!loading) {
        this.setState({ loading: true });
        let imgArray = [];
        const fd = new FormData();
        for (let index = 0; index < hotel_gallery.length; index += 1) {
          imgArray.push(hotel_gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('gallery_images', img);
          return img;
        });
        
        fd.append('hotel', JSON.stringify(hotel));
        this.setState({ loading: true });

        if(this.props.params.hotelId) {
          axios.patch(`${this.endPoint}/api/hotel/update`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        } else {
          axios.post(`${this.endPoint}/api/hotel/save`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
      // }
    }
  }
}

  render() {
    console.log(this.state)
    const {
      loading,
      hotel,
      cities,
      city,
      locations,
      location,
      users,
      user,
      description,
      amenities,
      showAmenities
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
                  <h2>Enter Hotel Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postHotel}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Hotel Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={hotel.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >City
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="city"
                          className="form-control"
                          value={hotel.city}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">User</label>
                          <div className="col-md-6 col-sm-6">
                            <Select
                              name="user_id"
                              value={user}
                              onChange={value => this.setUser(value)}
                              options={users}
                              valueKey="first_name"
                              labelKey="first_name"
                              // labelKey={`first_name last_name`}
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
                      <label className="control-label col-md-3 col-sm-3">Hotel Gallery</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          name="cover"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required={hotel.gallery ? 0 : 1}
                        />
                      </div>
                    </div>

                    {hotel.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {hotel.gallery.map((image,index) => {
                          return (
                            <span>
                          <img key={index}
                          style={{marginRight: '5px'}}
                          width="100"
                          className="img-fluid"
                          src={`${image.url}`}
                          alt="cover"
                        />
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} />
                        </span>
                          )
                        })}
                          
                        </div>
                      </div>
                      ) : null
                              }

                      <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Minimum Price
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="minimum_price"
                          className="form-control"
                          value={hotel.minimum_price}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="image_type"
                          value={hotel.image_type}
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
                      <div className="control-label col-md-3 col-sm-3">
                        <label style={{color: 'red'}} onClick={() => this.setState({ showAmenities: !showAmenities})}>Show Amenities<i style={{marginLeft: '5px'}} className={`${showAmenities ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i></label>
                      </div>
                      <div className="col-md-6 col-sm-6">
                      </div>
                    </div>

                    {
                      this.state.showAmenities ?
                      <div className="row" style={{marginBottom: '10px'}}>
                      {amenities.map((amenity, index) => (
                        <div className="col-sm-4" key={amenity.name}>
                          <div
                            className="form-group row amenitiesBox"
                            role="presentation"
                            tabIndex="-1"
                            style={style.amenitiesBox}
                            onClick={() => this.changeSelection(index)}
                          >
                            <table style={{ width: `${100}%` }}>
                              <tbody>
                                <tr>
                                  <td style={{
                                    width: `${100}px`,
                                    maxHeight: `${100}px`,
                                  }}
                                  >
                                    <img src={amenity.image} alt={amenity.name} className="float-left img-fluid" style={{width: '100%', height: '100px', objectFit: 'contain'}} />
                                  </td>
                                  <td>
                                    <span style={{
                                      marginLeft: `${15}px`,
                                      display: 'inline-block',
                                    }}
                                    >{amenity.name}
                                    </span>
                                  </td>
                                  <td style={{ width: `${25}px` }}>
                                    <input
                                      type="checkbox"
                                      name={amenity.name}
                                      checked={amenity.value}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))
                      }
                      </div>
                      : null
                    }

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Stars
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="star_rating"
                          className="form-control"
                          value={hotel.star_rating}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Website
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="url"
                          className="form-control"
                          value={hotel.url}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Pets Allowed</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="pets_allowed"
                          value={hotel.pets_allowed}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Value</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Smoking Allowed</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="smoking_allowed"
                          value={hotel.smoking_allowed}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Value</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Postal Code
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          // required
                          type="text"
                          name="postalCode"
                          className="form-control"
                          value={hotel.postalCode}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Hotel Star Rating
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="star_rating"
                          className="form-control"
                          value={hotel.star_rating}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Hotel Star Rating</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="stars"
                          value={hotel.stars}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="1">1 Star</option>
                          <option value="2">2 Star</option>
                          <option value="3">3 Star</option>
                          <option value="4">4 Star</option>
                          <option value="5">5 Star</option>
                          <option value="6">6 Star</option>
                          <option value="7">7 Star</option>
                        </select>
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
                          value={hotel.email}
                          onChange={this.handleInputChange}
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
                          type="text"
                          name="phone"
                          className="form-control"
                          value={hotel.phone}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Latitiude
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="latitude"
                          className="form-control"
                          value={hotel.latitude}
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
                          value={hotel.longitude}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Hotel Address
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="address"
                          className="form-control"
                          value={hotel.address}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

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

