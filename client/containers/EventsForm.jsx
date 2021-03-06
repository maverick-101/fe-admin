import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import moment from 'moment';
import { API_END_POINT } from '../../config';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';

export default class EventsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      event: {
        title: '',
        organizer: '',
        start_date: undefined,
        end_date: undefined,
        location_id: '',
        city_id: '',
        Address: '',
        gathering_type: '',
        free_entry: '',
        ticket_price: '',
        description: '',
        why_list: '',
        gallery: '',
        event_videos: '',
        recommended: false,
        contact_number: '',
        latitude: '',
        longitude: '',
        // video_link: ''
      },
      gallery: '',
      locations: [],
      location: '',
      cities: [],
      city: '',
      focusedInput: null,
      startDate: null,
      endDate: null,
      videoCount: 1,
      eventVideos: [{
        url: ''
      }],
      description: RichTextEditor.createEmptyValue(),
      whyList: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postEvent = this.postEvent.bind(this);
  }

  // componentDidMount() {
    // const { match } = this.props;
    // if (match.params.cityId) {
    //   axios.get(`/api/event/${match.params.cityId}`)
    //     .then((response) => {
    //       this.setState({
    //         event: response.data,
    //         description: RichTextEditor.createValueFromString(response.data.description, 'html'),
    //       });
    //     });
    // }
  // }

  componentWillMount() {
    this.getLocations();
    this.getCities();
  }

  componentDidMount() {
    console.log('props',this.props);
    const { match } = this.props;
      if (match.params.eventId) {
      axios.get(`${API_END_POINT}/api/fetchById/event-fetchById/${match.params.eventId}`)
        .then((response) => {
          this.setState({
            event: response.data,
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
            whyList: RichTextEditor.createValueFromString(response.data.why_list, 'html'),
          }, () => {
            this.setState({ eventVideos: this.state.event.event_videos})
            axios.get(`${API_END_POINT}/api/fetchById/city-fetchById/${this.state.event.city_id}`)
            .then((response) => {
              this.setState({
                city: response.data[0],
              }, () => {
                axios.get(`${API_END_POINT}/api/fetchById/location-fetchById/${this.state.event.location_id}`)
                .then((response) => {
                  this.setState({
                    location: response.data[0]
                  })
              });
            });
          });
        });
    })
  }
}

    getCities = () => {
      axios.get(`${API_END_POINT}/api/fetch/city-fetch`)
        .then((response) => {
          this.setState({
            cities: response.data,
          });
        });
    }

    setCity(selectedCity) {
      this.setState(prevState => ({
        city: selectedCity,
        event: {
          ...prevState.event,
          city_id: selectedCity.ID,
        },
      }))
    }

    getLocations = () => {
      axios.get(`${API_END_POINT}/api/fetch/locations-fetch`)
        .then((response) => {
          this.setState({
            locations: response.data,
          });
        });
    }

    setLocation(selectedLocation) {
      this.setState(prevState => ({
        location: selectedLocation,
        event: {
          ...prevState.event,
          location_id: selectedLocation.ID,
        },
      }));
    }

  setDescription(description) {
    const { event } = this.state;
    event.description = description.toString('html');
    this.setState({
      event,
      description,
    });
  }

  setWhyVisit(whyList) {
    const { event } = this.state;
    event.why_list = whyList.toString('html');
    this.setState({
      event,
      whyList,
    });
  }

  deleteImage = (url, ID, type) => {
    const data =  {ID, url, type}
    let requestBody = { 'eventGallery' : JSON.stringify(data)};
    if(confirm("Are you sure you want to delete this image?")) {
      // axios.delete(`${API_END_POINT}/api/delete/Image-deleteByPublicId`, {reqBody})
      axios.delete(`${API_END_POINT}/api/deleteGallery/event-deleteGallery`, {data: requestBody, headers:{Authorization: "token"}})
        .then(response => {
          if(response.status === 200) {
            window.alert('Image deleted Successfully!')
          }
          // const hotels = this.state.hotels[hotel_gallery].slice();
          // hotels.splice(index, 1);
          // this.setState({ hotels });

          const { event } = this.state;
          event.gallery.splice(index, 1);
          this.setState({ event });
        });
    }
  }

  handleInputChange(inputEvent) {
    const { value, name } = inputEvent.target;

    const { event } = this.state;
    event[name] = value;
    this.setState({ event });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  handleCover = (event) => {
    this.setState({ cover: event.target.files[0] });
  }

  handleEventVideos = (event, index) => {
    const { value, name } = event.target;

    const { eventVideos } = this.state;

    eventVideos[index].url = value;
    this.setState(prevState => ({ 
      eventVideos,
      event: {
        ...prevState.event,
        event_videos: eventVideos,
      },
     }));
  }

  postEvent(formEvent) {
    formEvent.preventDefault();
    const { match, history } = this.props;
    const { loading, event, gallery, cover } = this.state;
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

        fd.append('cover_photo', cover)

        fd.append('event', JSON.stringify(event));

        if(match.params.eventId) {
        axios.patch(`${API_END_POINT}/api/update/event-update`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
        else {
          // axios.post('/api/event/save', fd)
          axios.post(`${API_END_POINT}/api/save/event-save`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          })
          .catch((error) => {
            this.setState({
              loading: false,
            })
          });
        }
        }

  render() {
    const {
      loading,
      event,
      startDate,
      endDate,
      locations,
      location,
      cities,
      city,
      focusedInput,
      description,
      whyList,
      videoCount,
      eventVideos,
    } = this.state;
    console.log('STATE', this.state)
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
                  <h2>Enter Event Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postEvent}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Event Title
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="title"
                          className="form-control"
                          value={event.title}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Company/Organizer
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="organizer"
                          className="form-control"
                          value={event.organizer}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Ticket Price
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="ticket_price"
                          className="form-control"
                          value={event.ticket_price}
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
                          name="Address"
                          className="form-control"
                          value={event.Address}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Event Date</label>
                      <div className="col-md-6 col-sm-6">
                        <DateRangePicker
                            startDate={event.start_date ? moment(event.start_date) : startDate}
                            endDate={event.end_date ? moment(event.end_date) : endDate}
                            startDateId="date_input_start"
                            endDateId="date_input_end"
                            onDatesChange={({ startDate: dateStart, endDate: dateEnd }) => (
                            this.setState({
                                startDate: dateStart,
                                endDate: dateEnd,
                            }, () => {
                                this.setState(prevState => ({
                                    event: {...prevState.event, start_date: this.state.startDate, end_date: this.state.endDate},
                                }))
                            }))}
                            focusedInput={focusedInput}
                            onFocusChange={input => this.setState({ focusedInput: input })}
                            required
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
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
                        </div> */}

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Latitude
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="latitude"
                          className="form-control"
                          value={event.latitude}
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
                          value={event.longitude}
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
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Contact Number
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="contact_number"
                          className="form-control"
                          value={event.contact_number}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Gathering Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="gathering_type"
                          value={event.gathering_type}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="family">Family Only</option>
                          <option value="mix">Mix</option>
                          {/* <option value="balochistan">Balochistan</option>
                          <option value="khyberPakhtunKhawa">Khyber PakhtunKhawa</option>
                          <option value="gilgitBaltistan">Gilgit Baltistan</option>
                          <option value="azadKashmir">Azad Kashmir</option> */}
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Event Gallery</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="cover"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required={event.gallery ? 0 : 1}
                        />
                      </div>
                    </div>

                    {event.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {event.gallery.map((image,index) => {
                          return (
                            <span key={index}>
                              <img
                              style={{marginRight: '5px'}}
                              width="100"
                              className="img-fluid"
                              src={`${image.url}`}
                              alt="cover"
                            />
                            <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteImage(image.url, event.ID, 'gallery')}/>
                          </span>
                          )
                        })}
                          
                        </div>
                      </div>
                      ) : null
                              }

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Event Cover Photo</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="cover_photo"
                          className="form-control"
                          onChange={this.handleCover}
                          multiple
                          required={event.cover_photo ? 0 : 1}
                        />
                      </div>
                    </div>

                    {event.cover_photo
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                            <span>
                              <img
                              style={{marginRight: '5px'}}
                              width="100"
                              className="img-fluid"
                              src={`${event.cover_photo.url}`}
                              alt="cover"
                            />
                            <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteImage(image.url, event.ID, 'cover')}/>
                          </span>
                          
                        </div>
                      </div>
                      ) : null
                              }

                    <div className="row" style={{backgroundColor: '#E8E8E8', margin: '10px'}}>
                        <div className="control-label col-md-3 col-sm-3"></div>
                          <div className="col-md-8 col-sm-8">
                            <h3>Video Links</h3>
                        </div>
                      
                    {eventVideos.map((count, index) => {
                        return <div key={index}>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Link
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="event_videos"
                          className="form-control"
                          value={eventVideos[index].url}
                          onChange={(event) => this.handleEventVideos(event, index)}
                        />
                      </div>
                    </div>
                  </div>
                    })}
                    
                    <div style={{float: "right"}}>
                      <button type="button" style={{marginRight: '5px'}}
                      onClick={() => {
                        this.setState({
                          eventVideos: [...eventVideos, {}],
                          })
                        }}
                      className="btn btn-info btn-sm">Add Video
                      </button>
                      <button type="button" 
                      onClick={() => {
                        var { eventVideos } = this.state;
                        var newLink = Object.assign([], eventVideos)
                        newLink.pop()
                        this.setState({
                          eventVideos: newLink,
                        })
                        }
                      }
                      className={`btn btn-danger btn-sm ${eventVideos.length === 1 ? 'disabled' : ''}`}>Remove Video</button>
                    </div>
                </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Recommended</label>
                      <div className="col-md-6 col-sm-6">
                      <input
                        type="checkbox"
                        name='recommended'
                        checked={event.recommended}
                        onClick={() => {
                          event.recommended = !event.recommended;
                          this.setState({ event })
                        }}
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

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Why Visit</label>
                      <div className="col-md-6 col-sm-6">
                        <RichTextEditor
                          value={whyList}
                          toolbarConfig={toolbarConfig}
                          onChange={(e) => {
                            this.setWhyVisit(e);
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

