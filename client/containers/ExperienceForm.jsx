import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../../config';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class ExperienceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      experience: {
        experience_title: '',
        location_id: '',
        user_id: '',
        user_name: '',
        estimated_time: '',
        time: '',
        phone_number: '',
        menu: '',
        spoken_languages: [],
        created_At: '',
        star_rating: '',
        recommended: false,
        latitude: '',
        longitude: '',
        todo: [],
        gallery: [],
        guest_photos: [],
        todo: [],
        description: '',
        important_information: '',
        video_link: '',
      },
      toDo: [
        {
          todo_title: '',
          description: ''
        }
      ],
      gallery: '',
      guestPhotos: '',
      users: [],
      user: '',
      locations: [],
      location: '',
      description: RichTextEditor.createEmptyValue(),
      information: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postExperience = this.postExperience.bind(this);
  }

  componentWillMount() {
    this.getLocations();
    this.getUsers();
  }

  getUsers = () => {
    axios.get(`${API_END_POINT}/api/user/fetch`)
    .then((response) => {
      this.setState({
        users: response.data,
      });
    });
    axios.get(`${this.endPoint}/api/fetch/locations-fetch`)
    .then((response) => {
      this.setState({
        locations: response.data,
      });
    });
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
      experience: {
        ...prevState.experience,
        location_id: selectedLocation.ID,
      },
    }));
  }

  componentDidMount() {
    console.log('PROPS',this.props);
    const { match } = this.props;
    if (match.params.experienceId) {
      axios.get(`${API_END_POINT}/api/fetchById/experience-fetchById/${match.params.experienceId}`)
        .then((response) => {
          this.setState({
            experience: response.data[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
            information: RichTextEditor.createValueFromString(response.data.important_information, 'html'),
          }, () => {
            this.setState({
              toDo: this.state.experience.todo,
              description: RichTextEditor.createValueFromString(this.state.experience.description, 'html')
            })
            axios.get(`${API_END_POINT}/api/user/fetchById/${this.state.experience.user_id}`)
            .then((response) => {
              this.setState({
                user: response.data[0],
              });
            });
            axios.get(`${this.endPoint}/api/fetchById/location-fetchById/${this.state.experience.location_id}`)
            .then((response) => {
              this.setState({
                location: response.data[0],
              });
            });
          });
        });
      }
    }

    deleteImage = (url, ID) => {
      const data =  {ID, url}
      let requestBody = { 'experienceGallery' : JSON.stringify(data)};
      if(confirm("Are you sure you want to delete this image?")) {
        axios.delete(`${this.endPoint}/api/deleteGallery/experience-deleteGallery`, {data: requestBody, headers:{Authorization: "token"}})
          .then(response => {
            if(response.status === 200) {
              window.alert('Image deleted Successfully!')
            }
            const hotels = this.state.hotels[hotel_gallery].slice();
            hotels.splice(index, 1);
            this.setState({ hotels });
          });
      }
    }

  setDescription(description) {
    const { experience } = this.state;
    experience.description = description.toString('html');
    this.setState({
      experience,
      description,
    });
  }

  setInformation(information) {
    const { experience } = this.state;
    experience.important_information = information.toString('html');
    this.setState({
      experience,
      information,
    });
  }

  setLocation(selectedLocation) {
    this.setState(prevState => ({
      location: selectedLocation,
      experience: {
        ...prevState.experience,
        location_id: selectedLocation.ID,
      },
    }));
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { experience } = this.state;
    experience[name] = value;
    this.setState({ experience });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  handleGuestPhotos = (event) => {
    this.setState({ guestPhotos: event.target.files });
  }

  setUser(selectedUser) {
    this.setState(prevState => ({
      user: selectedUser,
      experience: {
        ...prevState.experience,
        user_name: selectedUser.first_name,
        user_id: selectedUser.ID,
      },
    }));
  }

  handleToDo = (event, index) => {
    const { value, name } = event.target;

    const { toDo } = this.state;

    toDo[index][name] = value;
    this.setState(prevState => ({ 
      toDo,
      experience: {
        ...prevState.experience,
        todo: toDo,
      },
     }));
  }

  postExperience(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, experience, gallery, guestPhotos } = this.state;
        this.setState({ loading: true });

        let imgArray = [];
        let guestPhotosArray = [];

        const fd = new FormData();
        for (let index = 0; index < gallery.length; index += 1) {
          imgArray.push(gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('gallery_images', img);
          return img;
        });

        for (let index = 0; index < guestPhotos.length; index += 1) {
          guestPhotosArray.push(guestPhotos[index]);
        }
        guestPhotosArray.forEach((img) => {
          fd.append('guest_photos', img);
          return img;
        });

        fd.append('experience', JSON.stringify(experience));

        if(match.params.experienceId) {
        axios.patch(`${API_END_POINT}/api/update/experience-update`, fd)
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
          // axios.post('/api/experience/save', fd)
          axios.post(`${API_END_POINT}/api/save/experience-save`, fd)
          .then((response) => {
            if (response.data === 'Experience Saved!') {
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
      experience,
      description,
      information,
      users,
      user,
      locations,
      location,
      toDo,
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
                    onSubmit={this.postExperience}
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
                          name="experience_title"
                          className="form-control"
                          value={experience.experience_title}
                          onChange={this.handleInputChange}
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
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Estimated Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="estimated_time"
                          className="form-control"
                          value={experience.estimated_time}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="text"
                          name="time"
                          className="form-control"
                          value={experience.time}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Phone Number
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="text"
                          name="phone_number"
                          className="form-control"
                          value={experience.phone_number}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Menu
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="menu"
                          className="form-control"
                          value={experience.menu}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                          <label className="control-label col-md-3 col-sm-3">User</label>
                          <div className="col-md-6 col-sm-6">
                            <Select
                              name="user_name"
                              value={user}
                              onChange={value => this.setUser(value)}
                              options={users}
                              valueKey="first_name"
                              labelKey="first_name"
                              clearable={false}
                              backspaceRemoves={false}
                              required
                            />
                          </div>
                        </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Recommended</label>
                      <div className="col-md-6 col-sm-6">
                      <input
                        type="checkbox"
                        name='recommended'
                        checked={experience.recommended}
                        onClick={() => {
                          experience.recommended = !experience.recommended;
                          this.setState({ experience })
                        }}
                      />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Rating
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="star_rating"
                          className="form-control"
                          value={experience.star_rating}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                      <div className="row" style={{backgroundColor: '#E8E8E8', margin: '10px'}}>
                        <div className="control-label col-md-3 col-sm-3"></div>
                          <div className="col-md-8 col-sm-8">
                            <h3>ToDo Details</h3>
                        </div>
                      
                      {toDo.map((event, index) => {
                        return <div key={index}>
                    <div className="form-group row">
                    {index >=1 ? <hr style={{borderTop: '1px solid gray'}}/> : null}
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >ToDo Title
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="todo_title"
                          className="form-control"
                          value={toDo[index].todo_title}
                          onChange={(event) => this.handleToDo(event, index)}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3">Description</label>
                        <div className="col-md-6 col-sm-6">
                          <textarea
                            rows="4"
                            name="description"
                            className="form-control"
                            value={toDo[index].description}
                            onChange={(event) => this.handleToDo(event, index)}
                          />
                        </div>
                      </div>
                  </div>
                    })}
                      <div style={{float: "right"}}>
                      <button type="button" style={{marginRight: '5px'}}
                      onClick={() => {
                        this.setState({
                          toDo: [...toDo, {}],
                          })
                        }}
                      className="btn btn-info btn-sm">Add toDo
                      </button>
                      <button type="button" 
                      onClick={() => {
                        var { toDo } = this.state;
                        var newToDo = Object.assign([], toDo)
                        newToDo.pop()
                        this.setState({
                          toDo: newToDo,
                        })
                        }
                      }
                      className={`btn btn-danger btn-sm ${toDo.length === 1 ? 'disabled' : ''}`}>Remove ToDo</button>
                    </div>
                </div>

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
                          value={experience.latitude}
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
                          value={experience.longitude}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Video Link
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          // required
                          type="text"
                          name="video_link"
                          className="form-control"
                          value={experience.video_link}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Experience Gallery</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          name="gallery"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required={experience.gallery ? 0 : 1}
                        />
                      </div>
                    </div>

                    {experience.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {experience.gallery.map((image,index) => {
                          return (
                          <span>
                            <img key={index}
                            style={{marginRight: '5px'}}
                            width="100"
                            className="img-fluid"
                            src={`${image.url}`}
                            alt="cover"
                          />
                          <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteImage(image.url, experience.ID)}/>
                        </span>
                          )
                        })}
                          
                        </div>
                      </div>
                      ) : null
                              }

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Guest Photos</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          name="gallery"
                          className="form-control"
                          onChange={this.handleGuestPhotos}
                          multiple
                        />
                      </div>
                    </div>

                    {experience.guest_gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {experience.guest_gallery.map((image,index) => {
                          return (
                          <span>
                          <img key={index}
                          style={{marginRight: '5px'}}
                          width="100"
                          className="img-fluid"
                          src={`${image.url}`}
                          alt="cover"
                        />
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteImage(image.url, experience.ID)}/>
                        </span>
                          )
                        })}
                          
                        </div>
                      </div>
                      ) : null
                              }

                    {experience.guest_photos
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {experience.gallery.map((image,index) => {
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

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Important Information</label>
                      <div className="col-md-6 col-sm-6">
                        <RichTextEditor
                          value={information}
                          toolbarConfig={toolbarConfig}
                          onChange={(e) => {
                            this.setInformation(e);
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
                    {/* </div> */}
                  </form>
                </div>
                </div>
              </div>
            </div>
          </div>
        // </div>
      // </div>
    );
  }
}

