import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import Broken from '../static/broken.png';

import HasRole from '../hoc/HasRole';

export default class Packages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      packages: [],
      activePage: 1,
      pages: 1,
      q: '',
      responseMessage: 'Loading Packages...'
    }
    this.endPoint = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    axios.get(`${this.endPoint}/api/fetch/packagePage-fetch`)
      .then(response => {
        this.setState({
          packages: response.data,
          pages: Math.ceil(response.data.length/10),
        })
      })
      .catch(err => {
        this.setState({ 
          responseMessage: 'No Packages Found'
        })
      })
  }
  deletePackage(pckgId, index) {
    if(confirm("Are you sure you want to delete this packge?")) {
      axios.delete(`${this.endPoint}/api/delete/packagePage-deleteById/${pckgId}`)
        .then(response => {
          const packages = this.state.packages.slice();
          packages.splice(index, 1);
          this.setState({ packages });
        });
    }
  }
  handleSelect(page) {
    axios.get(`/api/pckg?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          packages: response.data.items,
          activePage: page
        })
      })
  }
  handleSearch() {
    axios.get(`/api/pckg?q=${this.state.q}`)
      .then((response) => {
        this.setState({
          packages: response.data.items,
          activePage: 1,
          pages: Math.ceil(response.data.total/10)
        })
      })
  }
  render() {
    console.log(this.state)
    return (
      <div className="row">
        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Packages</h3>
            </div>
            <div style={{'marginTop':'20px'}} className="col-sm-4">
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
                <Link to="/package_form">
                  <button type="button" className="btn btn-success marginTop">Add new Package</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>City ID</th>
                  <th>Agent ID</th>
                  <th>Location ID</th>
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th> */}
                  <th>Latitude</th>
                  <th>Longitude</th>
                </tr>
              </thead>
              <tbody>
                {this.state.packages && this.state.packages.length >= 1 ?
                  this.state.packages.map((pckg, index) => (
                  <tr key={index}>
                    <td>{pckg.ID}</td>
                    <td>{<img style={{height: '50px', width: '50px'}} src={pckg.gallery ? pckg.gallery[0].url : Broken} />}</td>
                    <td>{pckg.package_title}</td>
                    <td>{pckg.city_id}</td>
                    <td>{pckg.agent_id}</td>
                    <td>{pckg.location_id}</td>
                    {/* <td>{pckg.marla_size}</td>
                    <td>{pckg.population}</td> */}
                    <td>{pckg.latitude}</td>
                    <td>{pckg.longitude}</td>
                    <td>
                      <Link to={`/package_resource_form/${pckg.ID}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td>
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/edit_package/${pckg.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deletePackage(pckg.ID, index)}></span>
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
