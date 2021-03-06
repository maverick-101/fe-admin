import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import moment from 'moment';
import { API_END_POINT } from '../../config';

import HasRole from '../hoc/HasRole';

export default class FeaturedHotels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      featuredHotels: [],
      activePage: 1,
      pages: 1,
      q: '',
      responseMessage: 'Loading Featured Hotels...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    axios.get(`${API_END_POINT}/api/fetch/featuredHotel-fetch`)
      .then(response => {
        this.setState({
          featuredHotels: response.data,
          pages: Math.ceil(response.data.length/10),
        })
      })
      .catch((error) => {
          this.setState({ 
            responseMessage: 'No Featured Hotels Found'
          })
      })
  }
  deleteHotel(hotelId, index) {
    if(confirm("Are you sure you want to delete this featured hotel?")) {
      axios.delete(`${API_END_POINT}/api/delete/featuredHotel-deleteById/${hotelId}`)
        .then(response => {
          const featuredHotels = this.state.featuredHotels.slice();
          featuredHotels.splice(index, 1);
          this.setState({ featuredHotels });
          if(response.status === 200) {
            window.alert('Deleted Successfully!')
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
  render() {
    return (
      <div className="row">
        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Featured Hotels</h3>
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
                <Link to={{
                        pathname: `/featured_hotels_form`,
                        state: { selectedForm: 'featuredHotels'}
                      }}>
                  <button type="button" className="btn btn-success marginTop">Add new Featured Hotel</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Hotel Id</th>
                  <th>Created At</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Starting Price</th>
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.featuredHotels && this.state.featuredHotels.length >= 1 ?
                  this.state.featuredHotels.map((featuredHotel, index) => (
                  <tr key={index}>
                    <td>{featuredHotel.ID}</td>
                    <td>{featuredHotel.hotel_id}</td>
                    <td>{moment(featuredHotel.createdAt).format('DD-MMM-YYYY')}</td>
                    <td>{moment(featuredHotel.start_date).format('DD-MMM-YYYY')}</td>
                    <td>{moment(featuredHotel.end_date).format('DD-MMM-YYYY')}</td>
                    <td>{featuredHotel.starting_price}</td>
                    {/* <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    {/* <td>
                      <Link to={`/area_resource/${featuredHotel.ID}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td> */}
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={{
                        pathname: `/edit_featured_hotels/${featuredHotel.ID}`,
                        state: { selectedForm: 'featuredHotels'}
                        }}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteHotel(featuredHotel.ID, index)}></span>
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
