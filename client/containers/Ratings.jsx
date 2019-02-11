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
      responseMessage: 'Loading Ratings...'
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

  fetchOrders(orderName) {
    if(orderName === 'hotels') {
    axios.get(`${this.endPoint}/api/fetch/hotelContact-fetch`)
      .then(response => {
        this.setState({
          ratings: response.data,
          pages: Math.ceil(response.data.length/10),
          responseMessage: 'No Ratings Found...'
        })
      })
      .catch(err => {
        this.setState({
          responseMessage: 'No Ratings for Hotels Found...'
        })
      })
    } else if(orderName === 'packages') {
      axios.get(`${this.endPoint}/api/fetch/packageContact-fetch`)
      .then(response => {
        this.setState({
          ratings: response.data,
          pages: Math.ceil(response.data.length/10),
          responseMessage: 'No Ratings Found...'
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

  handleOrderSelection(event) {
    this.setState({
      selectedRating: event.target.value,
    }, () => {
      this.fetchOrders(this.state.selectedRating)
    })
  }

  render() {
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
                          onChange={(event) => this.handleOrderSelection(event)}
                          required
                        >
                          <option value="">Select Rating Type</option>
                          <option value="packages">Packages</option>
                          <option value="hotels">Hotels</option>
                        </select>
                      </div>
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
