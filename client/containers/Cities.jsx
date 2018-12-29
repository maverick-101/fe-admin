import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import HasRole from '../hoc/HasRole';

export default class Cities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cities: [],
      activePage: 1,
      pages: 1,
      q: '',
    }
  }
  componentWillMount() {
    axios.get('/api/city/fetch')
      .then(response => {
        this.setState({
          cities: response.data,
          pages: Math.ceil(response.data.total/10)
        })
      })
  }
  deleteArea(areaId, index) {
    if(confirm("Are you sure you want to delete this area?")) {
      axios.delete(`/api/area/${areaId}`)
        .then(response => {
          const areas = this.state.areas.slice();
          areas.splice(index, 1);
          this.setState({ areas });
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
                <input  className='form-control' type="text" name="search" placeholder="Enter property type" value={this.state.q} onChange={(event) => this.setState({q: event.target.value})}/>
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
                  {console.log('cities',this.state.cities)}
                {this.state.cities && this.state.cities.length >= 1 &&
                  this.state.cities.map((city, index) => (
                  <tr key={index}>
                    <td>{city.name}</td>
                    <td>{city.province}</td>
                    <td>{city.views}</td>
                    {/* <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    <td>
                      <Link to={`/area_resource/${city.id}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td>
                    <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}>
                      <td>
                        <Link to={`/edit_city/${city.id}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" onClick={() => this.deletecity(city.id, index)}></span>
                      </td>
                    </HasRole>
                  </tr>
                ))}
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
