import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class ExperienceResourceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      experienceResources: {
        experienceResources_title: '',
        experience_id: '',
        image_type: '',
        images: [],
        description: '',
      },
      gallery: '',
      users: [],
      user: '',
      resources: [],
      responseMessage: 'Loading Resources...',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postExperienceResource = this.postExperienceResource.bind(this);
  }

  componentWillMount() {
    axios.get(`${this.endPoint}/api/user/fetch`)
    .then((response) => {
      this.setState({
        users: response.data,
      });
    });
  }

  componentDidMount() {
    this.setState(prevState => ({
      experienceResources: {
        ...prevState.experienceResources,
        experience_id: this.props.params.experienceId,
      },
    }));
    this.fetchResources();
  }

  fetchResources = () => {
    axios.get(`${this.endPoint}/api/fetchByExperienceId/experienceResources-fetchByExperienceId/${this.props.params.experienceId}`)
    .then((response) => {
      this.setState({
        resources: response.data,
        responseMessage: 'No Resources Found',
      })
    })
    .catch(() => {
      this.setState({
        responseMessage: 'No Resources Found',
      })
    })
  }

  setDescription(description) {
    const { experienceResources } = this.state;
    experienceResources.description = description.toString('html');
    this.setState({
      experienceResources,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { experienceResources } = this.state;
    experienceResources[name] = value;
    this.setState({ experienceResources });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  setUser(selectedUser) {
    this.setState(prevState => ({
      user: selectedUser,
      experienceResources: {
        ...prevState.experienceResources,
        user_name: selectedUser.first_name,
      },
    }));
  }
  deleteResource(resourceId, index) {
    if(confirm("Are you sure you want to delete this resource?")) {
      axios.delete(`${this.endPoint}/api/delete/experienceResources-deleteById/${resourceId}`)
        .then(response => {
          const resources = this.state.resources.slice();
          resources.splice(index, 1);
          this.setState({ resources });
        });
    }
  }

  postExperienceResource(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, experienceResources, gallery } = this.state;
        this.setState({ loading: true });

        let imgArray = [];
        const fd = new FormData();
        for (let index = 0; index < gallery.length; index += 1) {
          imgArray.push(gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('experience_images', img);
          return img;
        });

        fd.append('experienceResources', JSON.stringify(experienceResources));

        if(this.props.params.cityId) {
        // axios.patch('/api/experienceResources/update', fd)
        axios.patch(`${this.endPoint}/api/update/experienceResources-update`, fd)
          .then((response) => {
            if (response.data === 'Experience Updated!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
        else {
          axios.post(`${this.endPoint}/api/save/experienceResources-save`, fd)
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
        }
        }

  render() {
    const {
      loading,
      experienceResources,
      description,
      responseMessage
    } = this.state;
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
    console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          <div className="col-md-2 col-sm-2">
          
            </div>
            <div className="col-md-10 col-sm-10">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Experience Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postExperienceResource}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Experience Title
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="experienceResources_title"
                          className="form-control"
                          value={experienceResources.experienceResources_title}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="image_type"
                          value={experienceResources.image_type}
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

                    {/* <div className="form-group row">
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
                          value={experienceResources.longitude}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Experience Gallery</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          name="gallery"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required={experienceResources.gallery ? 0 : 1}
                        />
                      </div>
                    </div>

                    {experienceResources.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {experienceResources.gallery.map((image,index) => {
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

                 <h1>Resources Available</h1>
                <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr #</th>
                  <th>Type</th>
                  <th>No. of Resources</th>
                  <th>Image Type</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {this.state.resources && this.state.resources.length >= 1 ?
                this.state.resources.map((resource, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{resource._id}</td>
                  <td>{resource.Resources.length}</td>
                  <td>{resource.image_type}</td>
                  <td>{moment(resource.created_At).format('DD-MMM-YYYY HH:mm:ss')}</td>
                      <td>
                        <Link to={`/edit_room/${resource.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteResource(resource.Resources[0].ID, index)}></span>
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
      // </div>
    );
  }
}

