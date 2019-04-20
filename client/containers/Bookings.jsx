import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import Broken from '../static/broken.png';

import HasRole from '../hoc/HasRole';

export default class Bookings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookings: [],
      activePage: 1,
      pages: 1,
      q: '',
      responseMessage: 'Loading Bookings...'
    }
    this.endPoint = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    axios.get(`${this.endPoint}/api/fetch/booking-fetch`)
      .then(response => {
        this.setState({
          bookings: response.data,
          pages: Math.ceil(response.data.length/10),
          responseMessage: 'No Bookings Found...'
        })
      })
  }
  deleteCity(cityId, index) {
    if(confirm("Are you sure you want to delete this booking?")) {
      axios.delete(`${this.endPoint}/api/delete/booking-deleteById/${cityId}`)
        .then(response => {
          const bookings = this.state.bookings.slice();
          bookings.splice(index, 1);
          this.setState({ bookings });
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
  render() {
    return (
      <div className="row">
        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Bookings</h3>
            </div>
            <div style={{marginTop: '20px'}} className="col-sm-4">
              <div className='input-group'>
                <input  className='form-control' type="text" name="search" placeholder="Enter keyword" value={this.state.q} onChange={(event) => this.setState({q: event.target.value})}/>
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div>
            </div>
            {/* <div className="col-sm-2 pull-right">
              <HasRole requiredRole={['admin', 'data-entry']} requiredDepartment={['admin', 'sales']}>
                <Link to="/area_form">
                  <button type="button" className="btn btn-success marginTop">Add new Area</button>
                </Link>
              </HasRole>
            </div> */}

            <div className="col-sm-2 pull-right">
                <Link to="/booking_form">
                  <button type="button" className="btn btn-success marginTop">Add New Booking</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Province</th>
                  <th>Views</th>
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.bookings && this.state.bookings.length >= 1 ?
                  this.state.bookings.map((booking, index) => (
                  <tr key={index}>
                  {/* {console.log(booking.gallery[index])} */}
                    <td>{<img style={{height: '50px', width: '50px'}} src={booking.gallery ? booking.gallery[0].url : Broken} />}</td>
                    <td>{booking.name}</td>
                    <td>{booking.province}</td>
                    <td>{booking.views}</td>
                    {/* <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    {/* <td>
                      <Link to={`${this.endPoint}/area_resource/${booking.ID}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td> */}
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`${this.endPoint}/edit_booking/${booking.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteCity(booking.ID, index)}></span>
                      </td>
                    {/* </HasRole> */}
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
      </div>
    );
  }
}
