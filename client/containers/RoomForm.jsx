import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { Link } from 'react-router';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class RoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      room: {
        hotel_id: '',
        title: '',
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
        responseMessage: 'Loading Rooms...'
        // room_amenities: [],
      },
      gallery: '',
      // cities: [],
      // locations: [],
      hotel: '',
      rooms: [],
      // location: '',
      description: RichTextEditor.createEmptyValue(),
    };
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postHotel = this.postHotel.bind(this);
  }

  componentWillMount() {
    this.fetchRooms();
  }

  fetchRooms = () => {
    axios.get(`${this.endPoint}/api/room/fetch/`)
        .then((response) => {
          this.setState({
            rooms: response.data,
          });
        });
  }

  componentDidMount() {
    const { match } = this.props;
    const { room } = this.state;
    console.log('props',this.props)
    this.setState({
      room: {...room, hotel_id: this.props.params.hotelId}
    })
    axios.get(`${this.endPoint}/api/hotel/fetchById/${this.props.params.hotelId}`)
        .then((response) => {
          this.setState({
            hotel: response.data,
          });
        });
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
    let arr = []; 
    if (name === 'room_amenities') {
      arr.push(value)
      console.log(value)
      this.setState({
        room: {...room, room_amenities: arr}
      })
    } else {
    room[name] = value;
    this.setState({ room });
    }
    
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
          fd.append('gallery_images', img);
          return img;
        });

        fd.append('room', JSON.stringify(room));
        this.setState({ loading: true });
        // axios.post('/api/room/save', fd)
        axios.post(`${this.endPoint}/api/room/save`, fd)
          .then((response) => {
            if (response.data === 'Room Saved!') {
              window.alert(response.data);
              this.setState({ loading: false });
              this.fetchRooms();
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
      hotel,
      description,
      responseMessage
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
                  <h2>Enter Room Details</h2>
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
                          name="title"
                          className="form-control"
                          value={room.title}
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
                          required={room.gallery ? 0 : 1}
                        />
                      </div>
                    </div>

                    {room.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {room.gallery.map((image,index) => {
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

                    {/* <div className="form-group row">
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
                    </div> */}

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
                <h1>Rooms available at {this.props.location.state.hotelName}</h1>
                <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Persons Allowed</th>
                  <th>Beds Count</th>
                  <th>Bed Type</th>
                  {/* <th>Email</th> */}
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.rooms && this.state.rooms.length >= 1 ?
                this.state.rooms.map((room, index) => (
                  <tr key={index}>
                  <td>{room.ID}</td>
                  <td>{room.title}</td>
                  {/* <td>{<img style={{height: '50px', width: '50px'}} src={room.profile_picture.url}/>}</td> */}
                  <td>{room.persons}</td>
                  <td>{room.beds}</td>
                  <td>{room.bed_type}</td>
                    {/* <td>{room.firstName}</td>
                    <td>{room.phone}</td>
                    <td>{area.city.name}</td>
                    <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    {/* <td>
                      <Link to={`/area_resource/${area.id}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td> */}
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/edit_room/${room.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteUser(room.ID, index)}></span>
                      </td>
                    {/* </HasRole> */}
                    </tr>
                )) :
                (
                  <tr>
                    <td colSpan="15" className="text-center">{responseMessage}</td>
                  </tr>
                )
                }
              </tbody>
            </table>
          </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

