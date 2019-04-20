import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import Broken from '../static/broken.png';

import HasRole from '../hoc/HasRole';

export default class Ratings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ratings: [],
      rating: '',
      activePage: 1,
      pages: 1,
      q: '',
      selectedRating: undefined,
      responseMessage: 'Loading Ratings...',
      status: 'All'
    }
    this.endPoint = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    // axios.get(`${this.endPoint}/api/fetch/rating-fetch`)
    //   .then(response => {
    //     this.setState({
    //       ratings: response.data,
    //       pages: Math.ceil(response.data.length/10),
    //       responseMessage: 'No Ratings Found...'
    //     })
    //   })
  }

  changeStatus = (ratingId, ratingStatus) => {
    if(this.state.selectedRating === 'hotels') {
    axios.get(`${this.endPoint}/api/fetchById/hotelRating-fetchById/${ratingId}`)
      .then(response => {
        this.setState({
          rating: response.data,
        }, () => {
          this.setState(prevState => ({
            rating: {
                ...prevState.rating,
                status: ratingStatus,
            },
            }));
        })
            let updatedRating = {'hotelRating' : JSON.stringify(this.state.rating)}
              axios.patch(`${this.endPoint}/api/update/hotelRating-update`,  updatedRating)
              .then((response) => {
                window.alert(response.data)
              })
      })
    } else {
      axios.get(`${this.endPoint}/api/fetchById/packageRating-fetchById/${ratingId}`)
      .then(response => {
        this.setState({
          rating: response.data,
        }, () => {
          this.setState(prevState => ({
            rating: {
                ...prevState.rating,
                status: ratingStatus,
            },
            }));
        })
            let updatedRating = {'packageRating' : JSON.stringify(this.state.rating)}
              axios.patch(`${this.endPoint}/api/update/packageRating-update`,  updatedRating)
              .then((response) => {
                window.alert(response.data)
              })
      })
    }
  }

  fetchRatings(ratingName) {
    this.setState({ ratings: [] })
    if(ratingName === 'hotels') {
    axios.get(`${this.endPoint}/api/fetch/hotelRating-fetch`)
      .then(response => {
        this.setState({
          ratings: response.data,
          pages: Math.ceil(response.data.length/10),
        })
      })
      .catch(err => {
        this.setState({
          responseMessage: 'No Ratings for Hotels Found...'
        })
      })
    } else if(ratingName === 'packages') {
      axios.get(`${this.endPoint}/api/fetch/packageRating-fetch`)
      .then(response => {
        this.setState({
          ratings: response.data,
          pages: Math.ceil(response.data.length/10),
        })
      })
      .catch(err => {
        this.setState({
          responseMessage: 'No Ratings for Packages Found...'
        })
      })
    } else if(ratingName === 'experiences') {
      axios.get(`${this.endPoint}/api/fetch/experienceRating-fetch`)
      .then(response => {
        this.setState({
          ratings: response.data,
          pages: Math.ceil(response.data.length/10),
        })
      })
      .catch(err => {
        this.setState({
          responseMessage: 'No Ratings for Experiences Found...'
        })
      })
    }
  }

  switchRatingType = (type) => {
    const { selectedRating } = this.state;
    this.setState({
      status: type,
      ratings: [],
    })
    if(selectedRating === 'hotels') {
      if(type === 'All'){
        this.fetchRatings(selectedRating);
      } else {
      axios.get(`${this.endPoint}/api/fetchAll${type}/hotelRating-fetchAll${type}`)
        .then(response => {
          this.setState({
            ratings: response.data,
            pages: Math.ceil(response.data.length/10),
            responseMessage: 'No Ratings Found...'
          })
        })
        .catch((error) => {
          this.setState({
            responseMessage: 'No Ratings Found...'
          })
        })
      }
    }
    else if (selectedRating === 'packages') {
      if(type === 'All') {
        this.fetchRatings(selectedRating);
      } else {
      axios.get(`${this.endPoint}/api/fetchAll${type}/packageRating-fetchAll${type}`)
      .then(response => {
        this.setState({
          ratings: response.data,
          pages: Math.ceil(response.data.length/10),
          responseMessage: 'No Ratings Found...'
        })
      })
      .catch((error) => {
        this.setState({
          responseMessage: 'No Ratings Found...'
        })
      })
    }
  } else if (selectedRating === 'experiences') {
    if(type === 'All') {
      this.fetchRatings(selectedRating);
    } else {
    axios.get(`${this.endPoint}/api/fetchAll${type}/experienceRating-fetchAll${type}`)
    .then(response => {
      this.setState({
        ratings: response.data,
        pages: Math.ceil(response.data.length/10),
        responseMessage: 'No Ratings Found...'
      })
    })
    .catch((error) => {
      this.setState({
        responseMessage: 'No Ratings Found...'
      })
    })
  }
}

}

  deleteRating(ratingId, index) {
    if(confirm("Are you sure you want to delete this rating?")) {
      axios.delete(`${this.endPoint}/api/delete/${this.state.selectedRating === 'hotels'? 'hotel' : this.state.selectedRating === 'packages' ? 'package' : 'experience'}Rating-deleteById/${ratingId}`)
        .then(response => {
          const ratings = this.state.ratings.slice();
          ratings.splice(index, 1);
          this.setState({ ratings });
          if(response.status === 200) {
            window.alert('Rating deleted Successfully')
          }
        });
    }
  }
  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }
  handleSearch() {
    axios.get(`/api/area?q=${this.state.q}`)
      .then((response) => {
        this.setState({
          areas: response.data.items,
          activePage: 1,
          pages: Math.ceil(response.data.total/10)
        })
      })
  }

  handleRatingSelection(event) {
    this.setState({
      selectedRating: event.target.value,
      status: 'All'
    }, () => {
      this.fetchRatings(this.state.selectedRating)
    })
  }

  render() {
    const { status, selectedRating } = this.state;
    console.log(this.state);
    return (
      <div className="row">
        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Ratings</h3>
                </div>
              {this.state.selectedRating ? 
                <div className="col-sm-2 pull-right">
                  <Link to={{
                          pathname: `ratings_form`,
                          state: { selectedRating: this.state.selectedRating}
                        }}>
                    <button type="button" className="btn btn-success marginTop">Add new {this.state.selectedRating} Rating</button>
                  </Link>
                </div>
              : null}
          </div>

          <div className="form-group row">
                    <div className="col-sm-2">
                      {/* <label className="control-label col-md-3 col-sm-3" style={{float: "right", whiteSpace: 'nowrap'}}>Select Rating</label> */}
                    </div>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="selectedRating"
                          value={this.state.selectedRating}
                          className="form-control custom-select"
                          onChange={(event) => this.handleRatingSelection(event)}
                          required
                        >
                          <option value="">Select Rating Type</option>
                          <option value="packages">Packages</option>
                          <option value="hotels">Hotels</option>
                          <option value="experiences">Experiences</option>
                        </select>
                      </div>
                    </div>

            {selectedRating ?
          <div>         
            <div className="row justify-content-between">
            <div className="float-left col-sm-6 space-1">
            <button
                type="button"
                style={{
                  marginRight: 5,
                  borderRadius: 0,
                }}
                className={`${status === 'All' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.switchRatingType('All')}
              >All
              </button>
              <button
                type="button"
                style={{ borderRadius: 0 }}
                className={`${status === 'Pending' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.switchRatingType('Pending')}
              >Pending
              </button>
              <button
                type="button"
                style={{
                  marginLeft: 5,
                  borderRadius: 0,
                }}
                className={`${status === 'Accepted' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.switchRatingType('Accepted')}
              >Accepted
              </button>
              <button
                type="button"
                style={{
                  marginLeft: 5,
                  borderRadius: 0,
                }}
                className={`${status === 'Rejected' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.switchRatingType('Rejected')}
              >Rejected
              </button>
            </div>
          </div>

          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{selectedRating === 'hotels' ? 'Hotel ID' : selectedRating === 'packages' ? 'Package ID' : 'Experience ID'}</th>
                  <th>User ID</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {this.state.ratings && this.state.ratings.length >= 1 ?
                  this.state.ratings.map((rating, index) => (
                  <tr key={index}>
                    {/* <td>{<img style={{height: '50px', width: '50px'}} src={rating.gallery ? rating.gallery[0].url : Broken} />}</td> */}
                    <td>{rating.ID}</td>
                    <td>{selectedRating === 'hotels' ? rating.hotel_id : selectedRating === 'packages' ? rating.package_id : rating.experience_id}</td>
                    <td>{rating.user_id}</td>
                    <td>{rating.rating}</td>
                    <td>{rating.status}</td>
                    <td>{rating.comment}</td>
                    {status !== 'All' ?
                      <td>
                      {status === 'Accepted' || status === 'Rejected' ? 
                        <button type="button" className="btn btn-info btn-sm ml-2" onClick={() => this.changeStatus(rating.ID, 'PENDING')} style={{marginRight: '5px'}}>Pending</button>
                          : null}
                          {status === 'Pending' || status === 'Rejected' ? 
                          <button type="button" className="btn btn-success btn-sm" onClick={() => this.changeStatus(rating.ID, 'ACCEPTED')}style={{marginRight: '5px'}}>Accept</button>
                          : null}
                          {status === 'Pending' || status === 'Accepted' ? 
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => this.changeStatus(rating.ID, 'REJECTED')}>Reject</button>
                          : null}
                      </td>
                    : null}
                    <td>
                        <Link to={`/edit_rating/${rating.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                    <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteRating(rating.ID, index)}></span>
                      </td>
                  </tr>
                )):
                <tr>
                    <td colSpan="15" className="text-center">{this.state.responseMessage}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          
          <div className="text-center">
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div>
        </div>
        : null
      }
      </div>
    </div>
    );
  }
}
