import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import moment from 'moment';

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
        company: '',
        start_date: undefined,
        end_date: undefined,
        location_id: '',
        address: '',
        gathering_type: '',
        free_entry: '',
        ticket_price: '',
        description: '',
        gallery: '',
        video_links: '',
      },
      gallery: '',
      locations: [],
      location: '',
      focusedInput: null,
      startDate: null,
      endDate: null,
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postCity = this.postCity.bind(this);
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
  }

  componentDidMount() {
    console.log('props',this.props);
    const { match } = this.props;
      if (window.location.href.split('/')[3] === 'edit_city')
      axios.get(`${this.endPoint}/api/fetchById/event-fetchById/${match.params.cityId}`)
        .then((response) => {
          this.setState({
            event: response.data[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          });
        });
    }

    getLocations = () => {
      axios.get(`${this.endPoint}/api/fetch/locations-fetch`)
        .then((response) => {
          this.setState({
            locations: response.data,
          });
        });
    }

  setDescription(description) {
    const { event } = this.state;
    event.description = description.toString('html');
    this.setState({
      event,
      description,
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

  handleInputChange(inputEvent) {
    const { value, name } = inputEvent.target;

    const { event } = this.state;
    event[name] = value;
    this.setState({ event });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postCity(formEvent) {
    formEvent.preventDefault();
    const { match, history } = this.props;
    const { loading, event, gallery } = this.state;
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

        fd.append('event', JSON.stringify(event));

        if(match.params.cityId) {
        // axios.patch('/api/event/update', fd)
        axios.patch(`${this.endPoint}/api/update/event-update`, fd)
          .then((response) => {
            if (response.data === 'Event Updated!') {
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
          axios.post(`${this.endPoint}/api/save/event-save`, fd)
          .then((response) => {
            if (response.data === 'Event Saved!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
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
      focusedInput,
      description,
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
                    onSubmit={this.postCity}
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
                          name="company"
                          className="form-control"
                          value={event.company}
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
                      >Video Links
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="video_links"
                          className="form-control"
                          value={event.video_links}
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

