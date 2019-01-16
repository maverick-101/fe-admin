import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import moment from 'moment';

import HasRole from '../hoc/HasRole';

export default class CoverBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coverBanners: [],
      activePage: 1,
      pages: 1,
      q: '',
    }
    this.endPoint = 'https://api.saaditrips.com';
  }
  componentWillMount() {
    axios.get(`${this.endPoint}/api/coverbanner/fetch`)
      .then(response => {
        this.setState({
          coverBanners: response.data,
          pages: Math.ceil(response.data.length/10)
        })
      })
  }
  deleteCity(coverBannerId, index) {
    if(confirm("Are you sure you want to delete this area?")) {
      axios.delete(`/api/area/${coverBannerId}`)
        .then(response => {
          const coverBanners = this.state.coverBanners.slice();
          coverBanners.splice(index, 1);
          this.setState({ coverBanners });
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
              <h3>List of Cover Banners</h3>
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
                <Link to="/cover_banner_form">
                  <button type="button" className="btn btn-success marginTop">Add new Cover</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Image</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.coverBanners && this.state.coverBanners.length >= 1 &&
                  this.state.coverBanners.map((coverBanner, index) => (
                  <tr key={index}>
                    <td>{coverBanner.ID}</td>
                    <td>{<img style={{height: '50px', width: '70px'}} src={coverBanner.image.url}/>}</td>
                    <td>{moment(coverBanner.start_date).format('DD-MMM-YYYY')}</td>
                    <td>{moment(coverBanner.end_date).format('DD-MMM-YYYY')}</td>
                    {/* <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    <td>
                      <Link to={`/area_resource/${coverBanner.ID}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td>
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/edit_coverBanner/${coverBanner.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteCity(coverBanner.ID, index)}></span>
                      </td>
                    {/* </HasRole> */}
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
