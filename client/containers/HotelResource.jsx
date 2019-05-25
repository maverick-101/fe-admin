import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import moment from 'moment';
import { API_END_POINT } from '../../config';

import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class HotelResource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hotelResource: {
        hotelResources_title: '',
        image_type: '',
        hotel_id: '',
        description: '',
        created_At: new Date(),
      },
      resources: [],
      gallery: '',
      hotel: '',
      focusedInput: null,
      responseMessage: 'Loading Hotel Resources...',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postHotelResource = this.postHotelResource.bind(this);
  }

  componentDidMount() {
    console.log('props', this.props)
    const { match } = this.props;
    if (match.params.coverBannerId) {
      axios.get(`${API_END_POINT}/api/coverbanner/fetchById/${match.params.coverBannerId}`)
        .then((response) => {
          this.setState({
            hotelResource: response.data[0]
          },() => {
            axios.get(`${API_END_POINT}/api/hotel/fetchById/${this.state.hotelResource.hotel_id}`)
            .then((response) => {
              this.setState({
                hotel: response.data[0],
                startDate: moment(this.state.hotelResource.start_date),
                endDate: moment(this.state.hotelResource.end_date),
              })
            })
          });
        });
    }
  }

  componentWillMount() {
    const { match } = this.props;
      this.setState(prevState => ({
        hotelResource: {
          ...prevState.hotelResource,
          hotel_id: match.params.hotelId,
        },
      }));
      this.fetchResources();
    }
    
    fetchResources = () => {
      const { match } = this.props;
      axios.get(`${API_END_POINT}/api/fetchByHotelId/hotelResources-fetchByHotelId/${match.params.hotelId}`)
      .then((response) => {
        this.setState({
          resources: response.data,
          responseMessage: 'No Hotel Resources Found',
        })
      })
      .catch(() => {
        this.setState({
          responseMessage: 'No Hotel Resources Found',
        })
      })
    }

    deleteResource(resourceId, index) {
      if(confirm("Are you sure you want to delete this resource?")) {
        axios.delete(`${API_END_POINT}/api/delete/hotelResources-deleteById/${resourceId}`)
          .then(response => {
            const resources = this.state.resources.slice();
            resources.splice(index, 1);
            this.setState({ resources });
          });
      }
    }

  setDescription(description) {
    const { hotelResource } = this.state;
    hotelResource.description = description.toString('html');
    this.setState({
      hotelResource,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { hotelResource } = this.state;
    hotelResource[name] = value;
    this.setState({ hotelResource });
  }

  handleDateChange = (selectedDate) => {
    this.setState(prevState => ({
      hotelResource: {
        ...prevState.hotelResource,
        created_At: selectedDate
      },
    }));
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postHotelResource(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, hotelResource, gallery } = this.state;
        this.setState({ loading: true });

        let imgArray = [];
        const fd = new FormData();

        for (let index = 0; index < gallery.length; index += 1) {
          imgArray.push(gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('hotel_images', img);
          return img;
        });

        fd.append('hotelResources', JSON.stringify(hotelResource));

        // if(match.params.hotelId) {
        // axios.patch(`${API_END_POINT}/api/update/hotelImage-update`, fd)
        //   .then((response) => {
        //     if (response.data && response.status === 200) {
        //       window.alert(response.data);
        //       this.setState({ loading: false });
        //     } else {
        //       window.alert('ERROR')
        //       this.setState({ loading: false });
        //     }
        //   });
        // }
        // else {
          axios.post(`${API_END_POINT}/api/save/hotelResources-save`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
              this.fetchResources();
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        // }
      }

  render() {
    const {
      loading,
      hotelResource,
      hotel,
      description,
      focusedInput,
      responseMessage,
    } = this.state;
    console.log(this.state);
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
                  <h2>Enter Hotel Resources</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postHotelResource}
                  >

                  <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Title
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="hotelResources_title"
                          className="form-control"
                          value={hotel.hotelResources_title}
                          onChange={this.handleInputChange}
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
                          <option value="restaurant">Restaurant Image</option>
                          <option value="front_view">Front View Image</option>
                          <option value="lounge">Passage Images</option>
                          <option value="main_hall">Amenities Image</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image Upload</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="hotelResource"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required
                        />
                      </div>
                    </div>

                    {hotelResource.image
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                          style={{marginRight: '5px'}}
                          width="100"
                          className="img-fluid"
                          src={`${hotelResource.image.url}`}
                          alt="hotelResource"
                        />
                          
                        </div>
                      </div>
                      ) : null
                              }

                      <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Created At</label>
                      <div className="col-md-6 col-sm-6">
                      <DatePicker
                        className="form-control"
                        // selected={this.state.startDate}
                        selected={hotelResource.created_At}
                        onChange={this.handleDateChange}
                        style={{border: 'none'}}
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
            <h1>Resources Available at {this.props.location.state.hotelName}</h1>
                <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>No. of Images</th>
                  <th>Image Type</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {this.state.resources && this.state.resources.length >= 1 ?
                this.state.resources.map((resource, index) => (
                  <tr key={index}>
                  <td>{resource.ID}</td>
                  {/* <td>{resource.images.length}</td> */}
                  <td>{resource.image_type}</td>
                  <td>{moment(resource.created_At).format('DD-MMM-YYYY HH:mm:ss')}</td>
                      <td>
                        <Link to={`/edit_room/${resource.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteResource(resource.ID, index)}></span>
                      </td>
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

