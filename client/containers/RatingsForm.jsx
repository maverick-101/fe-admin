import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import _ from 'lodash';
import { API_END_POINT } from '../../config';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class RatingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      rating: {
        user_id: '',
        user_name: '',
        hotel_id: '',
        package_id: '',
        expereience_id: '',
        rating: '',
        status: '',
        comment: '',
      },
      packages: [],
      pckg: '',
      hotels: [],
      hotel: '',
      users: [],
      user: '',
      experiences: [],
      experience: '',
      gallery: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postRating = this.postRating.bind(this);
  }

  componentWillMount() {
    const { location } = this.props;
    this.fetchUsers();
    if (location.state.selectedRating === 'packages'){
      this.fetchPackages();
    } else if(location.state.selectedRating === 'hotels') {
      this.fetchHotels();
    } else {
      this.fetchExperiences();
    }
  }

  componentDidMount() {
    console.log('props',this.props);
    //   if (window.location.href.split('/')[3] === 'edit_city')
    //   axios.get(`${API_END_POINT}/api/fetchById/rating-fetchById/${match.params.cityId}`)
    //     .then((response) => {
    //       this.setState({
    //         rating: response.data[0],
    //         description: RichTextEditor.createValueFromString(response.data.description, 'html'),
    //       });
    //     });
    }

    fetchUsers() {
        axios.get(`${API_END_POINT}/api/user/fetch`)
        .then(response => {
        this.setState({
          users: response.data,
        })
      })
    }

    fetchHotels() {
        axios.get(`${API_END_POINT}/api/hotel/fetch`)
        .then(response => {
        this.setState({
          hotels: response.data,
        })
      })
    }

    fetchPackages() {
        axios.get(`${API_END_POINT}/api/fetch/packagePage-fetch`)
        .then(response => {
        this.setState({
          packages: response.data,
        })
      })
    }

    fetchExperiences() {
      axios.get(`${API_END_POINT}/api/fetch/experience-fetch`)
      .then(response => {
      this.setState({
        experiences: response.data,
      })
    })
  }

    setHotel = (selectedHotel) => {
        this.setState(prevState => ({
            hotel: selectedHotel,
            rating: {
                ...prevState.rating,
                hotel_id: selectedHotel.ID,
            },
            }));
        }
    
    setPackage = (selectedPackage) => {
    this.setState(prevState => ({
        pckg: selectedPackage,
        rating: {
            ...prevState.rating,
            package_id: selectedPackage.ID,
        },
        }));
    }

    setUser = (selectedUser) => {
        this.setState(prevState => ({
            user: selectedUser,
            rating: {
                ...prevState.rating,
                user_id: selectedUser.ID,
                user_name: `${selectedUser.first_name} ${selectedUser.last_name}`,
            },
            }));
        }

    setExperience = (selectedExperience) => {
      this.setState(prevState => ({
          experience: selectedExperience,
          rating: {
              ...prevState.rating,
              expereience_id: selectedExperience.ID,
          },
          }));
      }

  setDescription(description) {
    const { rating } = this.state;
    rating.comment = description.toString('html');
    this.setState({
      rating,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { rating } = this.state;
    rating[name] = value;
    this.setState({ rating });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postRating(event) {
    event.preventDefault();
    const { match, history, location } = this.props;
    const { loading, rating } = this.state;
        this.setState({ loading: true });

        const fd = new FormData();

        if(match.params.featuredPackageId || match.params.featuredHotelId) {
            axios.patch(`${API_END_POINT}/api/update/rating-update`, fd)
            .then((response) => {
                if (response.data === 'Featured Updated!') {
                window.alert(response.data);
                this.setState({ loading: false });
                } else {
                window.alert('ERROR')
                this.setState({ loading: false });
                }
            });
            }
        else {
            if(location.state.selectedRating === 'hotels') {
                let hotelRating = _.omit(rating, ['package_id'])
                let requestBody = { 'hotelRating' : JSON.stringify(hotelRating)};
                fd.append('hotelRating', JSON.stringify(rating));
                    axios.post(`${API_END_POINT}/api/save/hotelRating-save`, requestBody)
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
                } else if (location.state.selectedRating === 'packages') {
                    let packageRating = _.omit(rating, ['hotel_id'])
                    let requestBody = { 'packageRating' : JSON.stringify(packageRating)};
                    // fd.append('packageRating', JSON.stringify(rating));
                        axios.post(`${API_END_POINT}/api/save/packageRating-save`, requestBody)
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
                } else if (location.state.selectedRating === 'experiences') {
                  let experienceRating = _.omit(rating, ['hotel_id', 'package_id'])
                  let requestBody = { 'experienceRating' : JSON.stringify(experienceRating)};
                  // fd.append('packageRating', JSON.stringify(rating));
                      axios.post(`${API_END_POINT}/api/save/experienceRating-save`, requestBody)
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
        }

  render() {
    const {
      loading,
      rating,
      description,
      packages,
      pckg,
      hotels,
      hotel,
      users,
      user,
      experiences,
      experience,
    } = this.state;
    const { location } = this.props;
    const selectedFormName = _.startCase(location.state.selectedRating);
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
                  <h2>Enter {selectedFormName} Rating Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postRating}
                  >
                  <div className="form-group row">
                    <label className="control-label col-md-3 col-sm-3">User</label>
                    <div className="col-md-6 col-sm-6">
                        <Select
                            name="user_id"
                            value={user}
                            onChange={value => this.setUser(value)}
                            options={users}
                            valueKey="id"
                            labelKey="first_name"
                            clearable={false}
                            backspaceRemoves={false}
                            required
                        />
                    </div>
                </div>

                    {location.state.selectedRating === 'packages' ?
                  <div className="form-group row">
                    <label className="control-label col-md-3 col-sm-3">Package</label>
                    <div className="col-md-6 col-sm-6">
                        <Select
                            name="package_id"
                            value={pckg}
                            onChange={value => this.setPackage(value)}
                            options={packages}
                            valueKey="id"
                            labelKey="package_title"
                            clearable={false}
                            backspaceRemoves={false}
                            required
                        />
                    </div>
                </div>
                  :
                  null
                }

                {location.state.selectedRating === 'hotels' ?
                  <div className="form-group row">
                    <label className="control-label col-md-3 col-sm-3">Hotel</label>
                    <div className="col-md-6 col-sm-6">
                        <Select
                            name="hotel_id"
                            value={hotel}
                            onChange={value => this.setHotel(value)}
                            options={hotels}
                            valueKey="id"
                            labelKey="name"
                            clearable={false}
                            backspaceRemoves={false}
                            required
                            />
                        </div>
                    </div>
                      :
                    null
                }

                {location.state.selectedRating === 'experiences' ?
                  <div className="form-group row">
                    <label className="control-label col-md-3 col-sm-3">Experience</label>
                    <div className="col-md-6 col-sm-6">
                        <Select
                            name="experience_id"
                            value={experience}
                            onChange={value => this.setExperience(value)}
                            options={experiences}
                            valueKey="id"
                            labelKey="experience_title"
                            clearable={false}
                            backspaceRemoves={false}
                            required
                            />
                        </div>
                    </div>
                      :
                    null
                }

                <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Ratings
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="rating"
                          className="form-control"
                          value={rating.rating}
                          onChange={this.handleInputChange}
                          pattern="^[1-5]$"
                          title="Rating should only range between 1 to 5"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Status</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="status"
                          value={rating.status}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Value</option>
                          <option value="PENDING">Pending</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Comment</label>
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

