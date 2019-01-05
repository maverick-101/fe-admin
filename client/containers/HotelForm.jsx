import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class HotelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hotel: {
        name: '',
        city_id: '',
        location_id: '',
        address: '',
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
        geo: {
          latitude: '',
          longitude: '',
        },
        description: '',
        amenities: '',
      },
      hotel_gallery: '',
      cities: [],
      locations: [],
      city: '',
      location: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleFile = this.handleFile.bind(this);
    this.postHotel = this.postHotel.bind(this);
  }

  componentWillMount() {
    axios.get(`/api/city/fetch`)
        .then((response) => {
          this.setState({
            cities: response.data,
          });
        });
    axios.get(`/api/locations/fetch`)
    .then((response) => {
      this.setState({
        locations: response.data,
      });
    });
  }

  componentDidMount() {
    // const { match } = this.props;
    // if (match.params.cityId) {
    //   axios.get(`/api/city/${match.params.cityId}`)
    //     .then((response) => {
    //       this.setState({
    //         city: response.data,
    //         description: RichTextEditor.createValueFromString(response.data.description, 'html'),
    //       });
    //     });
    // }
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
          fd.append('hotel_gallery', img);
          return img;
        });

        fd.append('hotel', JSON.stringify(hotel));
        this.setState({ loading: true });
        axios.post('/api/city', fd)
          .then((response) => {
            if (response.data === 'Hotel Saved!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              history.push('/hotels');
            }
          });
      // }
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
                          // required={coverForm.url ? 0 : 1}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
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
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Hotel Amenities
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="amenities"
                          className="form-control"
                          value={hotel.amenities}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Stars
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="stars"
                          className="form-control"
                          value={hotel.stars}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Logo
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="logo"
                          className="form-control"
                          value={hotel.logo}
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
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
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
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
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
                          required
                          type="text"
                          name="postalCode"
                          className="form-control"
                          value={hotel.postalCode}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Star Rating
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
                          name="geo"
                          className="form-control"
                          value={hotel.geo.latitude}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Longitude
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="location"
                          className="form-control"
                          value={hotel.geo.longitude}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

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

