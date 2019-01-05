import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class RoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      room: {
        hotel_id: '',
        room_title: '',
        persons: '',
        beds: '',
        bed_type: '',
        // image_type: '',
        pets_allowed: '',
        smoking_allowed: '',
        // postalCode: '',
        // star_rating: '',
        // email: '',
        // phone: '',
        // geo: {
        //   latitude: '',
        //   longitude: '',
        // },
        packages: [],
        room_amenities: [],
      },
      gallery: '',
      // cities: [],
      // locations: [],
      // city: '',
      // location: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleFile = this.handleFile.bind(this);
    this.postHotel = this.postHotel.bind(this);
  }

  componentWillMount() {
    // axios.get(`/api/city/fetch`)
    //     .then((response) => {
    //       this.setState({
    //         cities: response.data,
    //       });
    //     });
    // axios.get(`/api/locations/fetch`)
    // .then((response) => {
    //   this.setState({
    //     locations: response.data,
    //   });
    // });
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
    const { room } = this.state;
    room.description = description.toString('html');
    this.setState({
      room,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { room } = this.state;
    room[name] = value;
    this.setState({ room });
  }

  // handleFile(event) {
  //   this.setState({
  //     gallery: event.target.files.length ? event.target.files[0] : '',
  //   });
  // }

  // setCity(selectedCity) {
  //   this.setState(prevState => ({
  //     city: selectedCity,
  //     room: {
  //       ...prevState.room,
  //       city_id: selectedCity.ID,
  //     },
  //   }));
  // }

  // setLocation(selectedLocation) {
  //   this.setState(prevState => ({
  //     location: selectedLocation,
  //     room: {
  //       ...prevState.room,
  //       location_id: selectedLocation.ID,
  //     },
  //   }));
  // }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postHotel(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, room, gallery } = this.state;
    if (!loading) {
        this.setState({ loading: true });
        let imgArray = [];
        const fd = new FormData();
        for (let index = 0; index < gallery.length; index += 1) {
          imgArray.push(gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('images', img);
          return img;
        });

        fd.append('room', JSON.stringify(room));
        this.setState({ loading: true });
        axios.post('/api/city', fd)
          .then((response) => {
            if (response.data === 'room Saved!') {
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
      room,
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
                  <h2>Enter room Details</h2>
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
                      >Room Title
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="room_title"
                          className="form-control"
                          value={room.room_title}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Room Gallery</label>
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
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Persons Allowed
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="persons"
                          className="form-control"
                          value={room.persons}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >No. of Beds
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="beds"
                          className="form-control"
                          value={room.beds}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Bed Type
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="bed_type"
                          className="form-control"
                          value={room.bed_type}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Room Amenities
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="room_amenities"
                          className="form-control"
                          value={room.room_amenities}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Pets Allowed</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="pets_allowed"
                          value={room.pets_allowed}
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
                          value={room.smoking_allowed}
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

