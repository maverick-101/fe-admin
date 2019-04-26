import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import moment from 'moment';

import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class PackageResource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      packageResource: {
        packageResources_title: '',
        package_id: '',
        city_id: '',
        image_type: '',
        created_At: new Date(),
        description: '',
      },
      resources: [],
      gallery: '',
      hotel: '',
      cities: [],
      city: '',
      focusedInput: null,
      responseMessage: 'Loading Package Resources...',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postPackageResource = this.postPackageResource.bind(this);
  }

  // componentDidMount() {
  //   console.log('props', this.props)
  //   if (match.params.coverBannerId) {
  //     axios.get(`${this.endPoint}/api/coverbanner/fetchById/${match.params.coverBannerId}`)
  //       .then((response) => {
  //         this.setState({
  //           packageResource: response.data[0]
  //         },() => {
  //           axios.get(`${this.endPoint}/api/hotel/fetchById/${this.state.packageResource.hotel_id}`)
  //           .then((response) => {
  //             this.setState({
  //               hotel: response.data[0],
  //               startDate: moment(this.state.packageResource.start_date),
  //               endDate: moment(this.state.packageResource.end_date),
  //             })
  //           })
  //         });
  //       });
  //   }
  // }

  componentWillMount() {
    const { match } = this.props;
    this.getCities();
      this.setState(prevState => ({
        packageResource: {
          ...prevState.packageResource,
          package_id: match.params.packageId,
        },
      }));
      this.fetchResources();
    }
    
    fetchResources = () => {
      const { match } = this.props;
      axios.get(`${this.endPoint}/api/fetchByPackageId/packageResources-fetchByPackageId/${match.params.packageId}`)
      .then((response) => {
        this.setState({
          resources: response.data,
          responseMessage: 'No Package Resources Found',
        })
      })
      .catch(() => {
        this.setState({
          responseMessage: 'No Package Resources Found',
        })
      })
    }

    getCities = () => {
      axios.get(`${this.endPoint}/api/fetch/city-fetch`)
        .then((response) => {
          this.setState({
            cities: response.data,
          });
        });
    }

    setCity(selectedCity) {
      this.setState(prevState => ({
        city: selectedCity,
        packageResource: {
          ...prevState.packageResource,
          city_id: selectedCity.ID,
        },
      }))
    }

    deleteResource(resourceId, index) {
      if(confirm("Are you sure you want to delete this resource?")) {
        axios.delete(`${this.endPoint}/api/delete/packageResources-deleteById/${resourceId}`)
          .then(response => {
            const resources = this.state.resources.slice();
            resources.splice(index, 1);
            this.setState({ resources });
            if(response.status === 200) {
              window.alert('Resource Deleted Successfully!')
            }
          });
      }
    }

  setDescription(description) {
    const { packageResource } = this.state;
    packageResource.description = description.toString('html');
    this.setState({
      packageResource,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { packageResource } = this.state;
    packageResource[name] = value;
    this.setState({ packageResource });
  }

  handleDateChange = (selectedDate) => {
    this.setState(prevState => ({
      packageResource: {
        ...prevState.packageResource,
        created_At: selectedDate
      },
    }));
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postPackageResource(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, packageResource, gallery } = this.state;
        this.setState({ loading: true });

        let imgArray = [];
        const fd = new FormData();

        for (let index = 0; index < gallery.length; index += 1) {
          imgArray.push(gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('package_images', img);
          return img;
        });

        fd.append('packageResources', JSON.stringify(packageResource));

        // if(match.params.packageId) {
        // axios.patch(`${this.endPoint}/api/update/hotelImage-update`, fd)
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
          axios.post(`${this.endPoint}/api/save/packageResources-save`, fd)
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
      packageResource,
      hotel,
      description,
      cities,
      city,
      focusedInput,
      responseMessage,
    } = this.state;
    console.log(this.state);
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
                  <h2>Enter Package Resources</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postPackageResource}
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
                          name="packageResources_title"
                          className="form-control"
                          value={packageResource.packageResources_title}
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
                      <label className="control-label col-md-3 col-sm-3">Image Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="image_type"
                          value={packageResource.image_type}
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
                          name="packageResource"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required
                        />
                      </div>
                    </div>

                    {packageResource.image
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                          style={{marginRight: '5px'}}
                          width="100"
                          className="img-fluid"
                          src={`${packageResource.image.url}`}
                          alt="packageResource"
                        />
                          
                        </div>
                      </div>
                      ) : null
                              }

                      {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Created At</label>
                      <div className="col-md-6 col-sm-6">
                      <DatePicker
                        className="form-control"
                        // selected={this.state.startDate}
                        selected={packageResource.created_At}
                        onChange={this.handleDateChange}
                        style={{border: 'none'}}
                      />
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
            <h1>Resources Available 
              {/* at  {this.props.location.state.hotelName} */}
            </h1>
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

