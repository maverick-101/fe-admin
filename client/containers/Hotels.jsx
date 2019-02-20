import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import Broken from '../static/broken.png';

import HasRole from '../hoc/HasRole';

export default class Hotels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hotels: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Hotels...'
    }
    this.endPoint = 'https://api.saaditrips.com';
  }
  componentWillMount() {
    axios.get(`${this.endPoint}/api/hotel/fetch`)
      .then(response => {
        this.setState({
          hotels: response.data,
          pages: Math.ceil(response.data.length/10),
          responseMessage: 'No Hotels Found'
        })
      })
  }

  deleteHotel(hotelId, index) {
    if(confirm("Are you sure you want to delete this area?")) {
      axios.delete(`/api/area/${hotelId}`)
        .then(response => {
          const hotels = this.state.hotels.slice();
          hotels.splice(index, 1);
          this.setState({ hotels });
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
    const { hotels, responseMessage } = this.state;
    return (
      <div className="row">
        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Hotels</h3>
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
                <Link to="/hotel_form">
                  <button type="button" className="btn btn-success marginTop">Add new Hotel</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>Address</th>
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {hotels && hotels.length >= 1 ?
                hotels.map((hotel, index) => (
                  <tr key={index}>
                    <td>{<img style={{height: '50px', width: '50px'}} src={hotel.gallery.length ? hotel.gallery[0].url : Broken} />}</td>
                    <td>{hotel.name}</td>
                    <td>{hotel.star_rating}</td>
                    <td>{hotel.address}</td>
                    {/* <td>{area.city.name}</td>
                    <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    <td>
                      <Link to={{
                          pathname: `/rooms/${hotel.ID}`,
                          state: { hotelName: hotel.name}
                        }}>
                        <button type="button" className="btn btn-info btn-sm">Rooms</button>
                      </Link>
                    </td>
                    <td>
                      <Link to={{
                          pathname: `/hotel_resource/${hotel.ID}`,
                          state: { hotelName: hotel.name}
                        }}>
                        <button type="button" className="btn btn-info btn-sm">Resources</button>
                      </Link>
                    </td>
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/edit_hotel/${hotel.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" onClick={() => this.deleteArea(area.id, index)}></span>
                      </td>
                    {/* </HasRole> */}
                  </tr>
                ))
              :
              <tr>
                    <td colSpan="15" className="text-center">{responseMessage}</td>
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
