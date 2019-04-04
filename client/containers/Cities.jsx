import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import Broken from '../static/broken.png';
import Swal from 'sweetalert2';

import HasRole from '../hoc/HasRole';

export default class Cities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cities: [],
      activePage: 1,
      pages: 1,
      q: '',
      responseMessage: 'Loading Cities...'
    }
    this.endPoint = 'https://api.saaditrips.com';
  }
  componentWillMount() {
    axios.get(`${this.endPoint}/api/fetch/city-fetch`)
      .then(response => {
        this.setState({
          cities: response.data,
          pages: Math.ceil(response.data.length/10),
          responseMessage: 'No Cities Found...'
        })
      })
  }
  deleteCity(cityId, index) {
    if(confirm("Are you sure you want to delete this city?")) {
      axios.delete(`${this.endPoint}/api/delete/city-deleteById/${cityId}`)
        .then(response => {
          if(response.status === 200) {
            Swal.fire({
              type: 'success',
              title: 'Deleted...',
              text: 'City has been deleted successfully!',
            })
          }
          
          const cities = this.state.cities.slice();
          cities.splice(index, 1);
          this.setState({ cities });
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
              <h3>List of Cities</h3>
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
                <Link to="/city_form">
                  <button type="button" className="btn btn-success marginTop">Add new City</button>
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
                {this.state.cities && this.state.cities.length >= 1 ?
                  this.state.cities.map((city, index) => (
                  <tr key={index}>
                  {/* {console.log(city.gallery[index])} */}
                    <td>{<img style={{height: '50px', width: '50px'}} src={city.gallery.length ? city.gallery[0].url : Broken} />}</td>
                    <td>{city.name}</td>
                    <td>{city.province}</td>
                    <td>{city.views}</td>
                    {/* <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    {/* <td>
                      <Link to={`${this.endPoint}/area_resource/${city.ID}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td> */}
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`${this.endPoint}/edit_city/${city.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteCity(city.ID, index)}></span>
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
