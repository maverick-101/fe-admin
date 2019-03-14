import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import moment from 'moment';
import { Link } from 'react-router';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class ExperienceRatingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      experienceRating: {
        experience_id: '',
        user_name: '',
        user_id: '',
        rating: '',
        created_At: '',
        status: '',
        comment: '',
      },
      gallery: '',
      ratings: [],
      users: [],
      user: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postExperienceRating = this.postExperienceRating.bind(this);
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
      experienceRating: {
        ...prevState.experienceRating,
        experience_id: this.props.params.experienceId,
      },
    }));
    this.fetchRatings();
  }

  fetchRatings = () => {
    axios.get(`${this.endPoint}/api/fetchByExperienceId/experienceRating-fetchByExperienceId/${this.props.params.experienceId}`)
    .then((response) => {
      this.setState({
        ratings: response.data,
        responseMessage: 'No Ratings Found',
      })
    })
    .catch(() => {
      this.setState({
        responseMessage: 'No Ratings Found',
      })
    })
  }

  setDescription(description) {
    const { experienceRating } = this.state;
    experienceRating.description = description.toString('html');
    this.setState({
      experienceRating,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { experienceRating } = this.state;
    experienceRating[name] = value;
    this.setState({ experienceRating });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  setUser(selectedUser) {
    this.setState(prevState => ({
      user: selectedUser,
      experienceRating: {
        ...prevState.experienceRating,
        user_name: selectedUser.first_name,
        user_id: selectedUser.ID,
      },
    }));
  }

  deleteRating(ratingId, index) {
    if(confirm("Are you sure you want to delete this rating?")) {
      axios.delete(`${this.endPoint}/api/delete/experienceRating-deleteById/${ratingId}`)
        .then(response => {
          const ratings = this.state.ratings.slice();
          ratings.splice(index, 1);
          this.setState({ ratings });
        });
    }
  }

  postExperienceRating(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, experienceRating, gallery } = this.state;
        this.setState({ loading: true });

        // let imgArray = [];
        // const fd = new FormData();
        // for (let index = 0; index < gallery.length; index += 1) {
        //   imgArray.push(gallery[index]);
        // }
        //   imgArray.forEach((img) => {
        //   fd.append('gallery_images', img);
        //   return img;
        // });

        // fd.append('experienceRating', JSON.stringify(experienceRating));
        let requestBody = { 'experienceRating' : JSON.stringify(this.state,experienceRating)};

        if(this.props.params.cityId) {
        // axios.patch('/api/experienceRating/update', fd)
        axios.patch(`${this.endPoint}/api/update/experienceRating-update`, fd)
          .then((response) => {
            if (response.data && reponse.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
        else {
          axios.post(`${this.endPoint}/api/save/experienceRating-save`, requestBody)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
              this.fetchRatings();
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
      experienceRating,
      users,
      user,
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
                    onSubmit={this.postExperienceRating}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Rating
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="rating"
                          className="form-control"
                          value={experienceRating.rating}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Status</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="status"
                          value={experienceRating.status}
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

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Recommended</label>
                      <div className="col-md-6 col-sm-6">
                      <input
                        type="checkbox"
                        name='recommended'
                        checked={experienceRating.recommended}
                        onClick={() => {
                          experienceRating.recommended = !experienceRating.recommended;
                          this.setState({ experienceRating })
                        }}
                      />
                      </div>
                    </div> */}

                    {/* <div className="form-group row">
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
                          value={experienceRating.latitude}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Comment
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="comment"
                          className="form-control"
                          value={experienceRating.comment}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {experienceRating.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {experienceRating.gallery.map((image,index) => {
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

                    {/* <div className="form-group row">
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
                    </div> */}
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
                <h1>Ratings</h1>
                <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr #</th>
                  <th>ID</th>
                  <th>No. of Ratings</th>
                  <th>Image Type</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {this.state.ratings && this.state.ratings.length >= 1 ?
                this.state.ratings.map((rating, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{rating.ID}</td>
                  {/* <td>{rating.Resources.length}</td> */}
                  <td>{rating.image_type}</td>
                  <td>{moment(rating.created_At).format('DD-MMM-YYYY HH:mm:ss')}</td>
                      <td>
                        <Link to={`/edit_room/${rating.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteRating(rating.ID, index)}></span>
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

