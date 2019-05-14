import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../../config';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class AreaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      location: {
        name: '',
        city_id: '',
        province: '',
        // views: '',
        image_type: '',
        description: '',
        recommended: false,
        video_link: '',
      },
      gallery: '',
      city: '',
      cities: [],
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postArea = this.postArea.bind(this);
  }

  componentWillMount() {
    axios.get(`${API_END_POINT}/api/fetch/city-fetch?all=true`)
        .then((response) => {
          this.setState({
            cities: response.data.items,
          });
        });
  }

  componentDidMount() {
    console.log('props',this.props);
    const { match } = this.props;
      if (match.params.areaId)
      axios.get(`${API_END_POINT}/api/fetchById/location-fetchById/${match.params.areaId}`)
        .then((response) => {
          this.setState({
            location: response.data[0],
            description: RichTextEditor.createValueFromString(response.data[0].description, 'html'),
          }, () => {
            axios.get(`${API_END_POINT}/api/fetchById/city-fetchById/${this.state.location.city_id}`)
            .then((response) => {
              this.setState({
                city: response.data[0],
              });
            });
          });
        });
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

  // handleFile = (event) => {
  //   this.setState({
  //     files: event.target.files.length ? event.target.files[0] : '',
  //   });
  // }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      location: {
        ...prevState.location,
        city_id: selectedCity.ID,
        province: selectedCity.province
      },
    }))
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postArea(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, location, gallery } = this.state;
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
        fd.append('location', JSON.stringify(location));

        if(match.params.areaId) {
          // axios.patch('/api/locations/update', fd)
          axios.patch(`${API_END_POINT}/api/update/location-update`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        } else {
          // axios.post('/api/locations/save', fd)
          axios.post(`${API_END_POINT}/api/save/location-save`, fd)
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
      }
    }

    deleteImage = (url, ID) => {
      const data =  {ID, url}
      let requestBody = { 'locationGallery' : JSON.stringify(data)};
      if(confirm("Are you sure you want to delete this image?")) {
        // axios.delete(`${API_END_POINT}/api/delete/Image-deleteByPublicId`, {reqBody})
        axios.delete(`${API_END_POINT}/api/deleteGallery/location-deleteGallery`, {data: requestBody, headers:{Authorization: "token"}})
          .then(response => {
            if(response.status === 200) {
              window.alert('Image deleted Successfully!')
            }
            // const location = this.state.location[gallery].slice();
            // location.splice(index, 1);
            // this.setState({ location });

            const { location } = this.state;
            location.gallery.splice(index, 1);
            this.setState({ location });
          });
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
                  <h2>Enter location Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postArea}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Location Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={location.name}
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
                          value={location.city}
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

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Province</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="province"
                          value={location.province}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="punjab">Punjab</option>
                          <option value="sindh">Sindh</option>
                          <option value="balochistan">Balochistan</option>
                          <option value="khyberPakhtunKhawa">Khyber PakhtunKhawa</option>
                          <option value="gilgitBaltistan">Gilgit Baltistan</option>
                          <option value="azadKashmir">Azad Kashmir</option>
                        </select>
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Province
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="province"
                          className="form-control"
                          value={location.province}
                          onChange={this.handleInputChange}
                          disabled={location.city_id ? 1 : 0}
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
                          value={location.video_link}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Location Gallery</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          name="cover"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required={location.gallery ? 0 : 1}
                        />
                      </div>
                    </div>

                    {location.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {location.gallery.map((image,index) => {
                          return (
                          <span key={index}>
                            <img
                            style={{marginRight: '5px'}}
                            width="100"
                            className="img-fluid"
                            src={`${image.url}`}
                            alt="cover"
                          />
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteImage(image.url, location.ID)}/>
                        </span>
                          )
                        })}
                        </div>
                      </div>
                      ) : null
                              }

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Recommended</label>
                      <div className="col-md-6 col-sm-6">
                      <input
                        type="checkbox"
                        name='recommended'
                        checked={location.recommended}
                        onClick={() => {
                          location.recommended = !location.recommended;
                          this.setState({ location })
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
