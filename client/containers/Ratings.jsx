import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import Broken from '../static/broken.png';

import HasRole from '../hoc/HasRole';

export default class Ratings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ratings: [],
      activePage: 1,
      pages: 1,
      q: '',
      selectedRating: undefined,
      responseMessage: 'Loading Ratings...',
      listingType: 'active'
    }
    this.endPoint = 'https://api.saaditrips.com';
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

  fetchRatings(ratingName) {
    if(ratingName === 'hotels') {
    axios.get(`${this.endPoint}/api/fetch/hotelRating-fetch`)
      .then(response => {
        this.setState({
          ratings: response.data,
          pages: Math.ceil(response.data.length/10),
          listingType: 'pending',
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
    }
  }
  deleteCity(cityId, index) {
    if(confirm("Are you sure you want to delete this rating?")) {
      axios.delete(`${this.endPoint}/api/delete/rating-deleteById/${cityId}`)
        .then(response => {
          const ratings = this.state.ratings.slice();
          ratings.splice(index, 1);
          this.setState({ ratings });
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
    }, () => {
      this.fetchRatings(this.state.selectedRating)
    })
  }

  render() {
    const { listingType } = this.state;
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
              
            {/* <div className="col-sm-6">
                <Link to="/area_form">
                  <button type="button" className="btn btn-lg btn-success marginTop">Packages</button>
                </Link>
            </div>
            <div className="col-sm-6">
                <Link to="/area_form">
                  <button type="button" className="btn btn-lg btn-success marginTop">Hotels</button>
                </Link>
            </div> */}
            {/* <div style={{marginTop: '20px'}} className="col-sm-4">
              <div className='input-group'>
                <input  className='form-control' type="text" name="search" placeholder="Enter keyword" value={this.state.q} onChange={(event) => this.setState({q: event.target.value})}/>
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div>
            </div> */}
            {/* <div className="col-sm-2 pull-right">
              <HasRole requiredRole={['admin', 'data-entry']} requiredDepartment={['admin', 'sales']}>
                <Link to="/area_form">
                  <button type="button" className="btn btn-success marginTop">Add new Area</button>
                </Link>
              </HasRole>
            </div> */}

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
                        </select>
                      </div>
                    </div>

                    <div className="row justify-content-between">
            <div className="float-left col-sm-6 space-1">
              <button
                type="button"
                style={{ borderRadius: 0 }}
                className={`${listingType === 'active' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.fetchRatings('active')}
              >Active
              </button>
              <button
                type="button"
                style={{
                  marginLeft: 5,
                  borderRadius: 0,
                }}
                className={`${listingType === 'pending' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.fetchRatings('pending')}
              >Deactivated
              </button>
            </div>
            {/* <div className="float-right col-sm-6 text-right">
              <button
                type="button"
                style={{
                  marginRight: 5,
                  marginBottom: 5,
                  borderRadius: 0,
                }}
                className={`${activeButton === 'pending' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.handleFilter('pending')}
              >Pending
              </button>
              <button
                type="button"
                style={{
                  marginRight: 5,
                  marginBottom: 5,
                  borderRadius: 0,
                }}
                className={`${activeButton === 'mop' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.handleFilter('mop')}
              >Pending MOP
              </button>
              <button
                type="button"
                style={{
                  marginRight: 5,
                  marginBottom: 5,
                  borderRadius: 0,
                }}
                className={`${activeButton === 'mop_cleared' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.handleFilter('mop_cleared')}
              >MOP Cleared
              </button>
              <button
                type="button"
                style={{
                  marginRight: 5,
                  marginBottom: 5,
                  borderRadius: 0,
                }}
                className={`${activeButton === 'published' ? 'btn-primary' : ''} btn btn-default`}
                onClick={() => this.handleFilter('published')}
              >Published
              </button>
            </div> */}
          </div>

          {this.state.selectedRating ?
          <div> 
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Province</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {this.state.ratings && this.state.ratings.length >= 1 ?
                  this.state.ratings.map((rating, index) => (
                  <tr key={index}>
                    <td>{<img style={{height: '50px', width: '50px'}} src={rating.gallery ? rating.gallery[0].url : Broken} />}</td>
                    <td>{rating.name}</td>
                    <td>{rating.province}</td>
                    <td>{rating.views}</td>
                    <td>
                      <Link to={`${this.endPoint}/area_resource/${rating.ID}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
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
