import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class AreaResource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      location: {
        name: '',
        city_id: '',
        location_id: '',
        province: '',
        views: '',
        type: '',
        status: '',
        description: '',
        URL: '',
      },
      gallery: '',
      city: '',
      cities: [],
      resources: [],
      description: RichTextEditor.createEmptyValue(),
      responseMessage: 'Loading Resources...'
    };
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postAreaResource = this.postAreaResource.bind(this);
  }

  componentWillMount() {
    axios.get(`${this.endPoint}/api/fetch/city-fetch`)
        .then((response) => {
          this.setState({
            cities: response.data,
          },() => {
              this.fetchResources();
          });
        });
  }

  fetchResources = () => {
    const { match } = this.props;
    axios.get(`${this.endPoint}/api/lcoationResources/fetchByLocationId/${match.params.areaId}`)
    .then((response) => {
        this.setState({
        resources: response.data,
        responseMessage: 'No resources found'
        });
    });
  }

  componentDidMount() {
    const { match } = this.props;
    this.setState(prevState => ({
      location: {
        ...prevState.location,
        location_id: match.params.areaId,
      },
    }));
      if (match.params.areaId) {
      axios.get(`${this.endPoint}/api/fetchById/location-fetchById/${match.params.areaId}`)
        .then((response) => {
          this.setState({
            location: response.data[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          }, () => {
            axios.get(`${this.endPoint}/api/fetchById/city-fetchById/${this.state.location.city_id}`)
            .then((response) => {
              this.setState({
                city: response.data[0],
              });
            });
          });
        });
      }
    }

  setDescription(description) {
    const { location } = this.state;
    location.description = description.toString('html');
    this.setState({
      location,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { location } = this.state;
    location[name] = value;
    this.setState({ location });
  }


  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      location: {
        ...prevState.location,
        city_id: selectedCity.ID,
      },
    }));
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  deleteArea(areaId, index) {
    if(confirm("Are you sure you want to delete this area?")) {
      axios.delete(`/api/area/${coverBannerId}`)
        .then(response => {
          const location = this.state.location.slice();
          location.splice(index, 1);
          this.setState({ location });
        });
    }
  }

  postAreaResource(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, location, gallery } = this.state;
    if (!loading) {
        this.setState({ loading: true });

        const fd = new FormData();
        fd.append('locationResources', JSON.stringify(location));

        if(match.params.resourceId) {
          axios.patch(`${this.endPoint}/api/lcoationResources/update`, fd)
          .then((response) => {
            if (response.data === 'locationResources Updated!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        } else {
          axios.post(`${this.endPoint}/api/lcoationResources/save`, fd)
          .then((response) => {
            if (response.data === 'locationResources Saved!') {
              window.alert(response.data);
              this.fetchResources();
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
      location,
      cities,
      city,
      description,
      responseMessage,
    } = this.state;

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          <div className="col-md-2 col-sm-2">
          
            </div>
            <div className="col-md-10 col-sm-10">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Area Resource Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postAreaResource}
                  >

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
                              disabled
                            />
                          </div>
                        </div>

                        <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Location
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="location"
                          className="form-control"
                          value={location.name}
                          onChange={this.handleInputChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >URL
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="URL"
                          className="form-control"
                          value={location.URL}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Resource Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="type"
                          value={location.type}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Status</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="status"
                          value={location.status}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">In-active</option>
                        </select>
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
                <h1>Available Resources </h1>
                {/* <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Resource Type</th>
                  <th>Status</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {this.state.resources && this.state.resources.length >= 1 ?
                this.state.resources.map((resource, index) => (
                  <tr key={index}>
                  <td>{resource.ID}</td>
                  <td>{resource.type}</td>
                  <td>{resource.status}</td>
                  <td>{resource.URL}</td>
                      <td>
                        <Link to={`/edit_resource/${resource.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteArea(resource.ID, index)}></span>
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
          </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
