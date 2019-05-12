import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import Broken from '../static/broken.png';
import { API_END_POINT } from '../../config';

import HasRole from '../hoc/HasRole';

export default class Area extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      areas: [],
      activePage: 1,
      pages: 1,
      q: '',
      pageSize: 10,
      responseMessage: 'Loading Areas...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    // axios.get(`${API_END_POINT}/api/fetch/locations-fetch`)
    // axios.get(`${API_END_POINT}/api/fetch/locations-fetch?all=true`)
    axios.get(`https://api.saaditrips.com/api/fetch/locations-fetch`, this.getParams())
      .then(response => {
        this.setState({
          areas: response.data.items,
          pages: Math.ceil(response.data.total/10),
          responseMessage: 'No Areas Found...'
        })
      })
  }
  
  getParams() {
    const {
      activePage,
      pageSize,
    } = this.state;
    return {
      params: {
        pageNumber: activePage,
        pageSize,
      },
    };
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
    this.setState({ activePage: page }, () => {
      // axios.get(`${API_END_POINT}/api/fetch/locations-fetch`, this.getParams())
    axios.get(`https://api.saaditrips.com/api/fetch/locations-fetch`, this.getParams())
    .then(response => {
      this.setState({
        areas: response.data.items,
        activePage: page
      })
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
              <h3>List of Areas</h3>
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
                <Link to="/area_form">
                  <button type="button" className="btn btn-success marginTop">Add new Area</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Views</th>
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.areas && this.state.areas.length >= 1 ?
                  this.state.areas.map((area, index) => (
                  <tr key={index}>
                    <td>{<img style={{height: '50px', width: '50px'}} src={area.gallery.length ? area.gallery[0].url : Broken} />}</td>
                    <td>{area.name}</td>
                    {/* <td>{area.size}</td> */}
                    <td>{area.views}</td>
                    {/* <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    <td>
                      <Link to={`/area_resource/${area.ID}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td>
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/edit_area/${area.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteArea(area.ID, index)}></span>
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
