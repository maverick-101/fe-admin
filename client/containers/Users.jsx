import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import HasRole from '../hoc/HasRole';

export default class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Users...'
    }
    this.endPoint = 'https://api.saaditrips.com';
  }
  componentWillMount() {
    this.setState({ loading: true })
    axios.get(`${this.endPoint}/api/user/fetch`)
      .then(response => {
        this.setState({
          users: response.data,
          pages: Math.ceil(response.data.length/10),
          loading: false,
          responseMessage: 'No Users Found'
        })
      })
  }
  deleteUser(userId, index) {
    if(confirm("Are you sure you want to delete this area?")) {
      axios.delete(`/api/area/${userId}`)
        .then(response => {
          const users = this.state.users.slice();
          users.splice(index, 1);
          this.setState({ users });
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
    console.log(this.state);
    const {loading, users, responseMessage} = this.state; 
    return (
      <div className="row">
        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Users</h3>
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
                <Link to="/user_form">
                  <button type="button" className="btn btn-success marginTop">Add new User</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Picture</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.users && this.state.users.length >= 1 ?
                this.state.users.map((user, index) => (
                  <tr key={index}>
                  <td>{user.ID}</td>
                  <td>{<img style={{height: '50px', width: '50px'}} src={user.profile_picture.url}/>}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                    {/* <td>{user.firstName}</td>
                    <td>{user.phone}</td>
                    <td>{area.city.name}</td>
                    <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    {/* <td>
                      <Link to={`/area_resource/${area.id}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td> */}
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/edit_user/${user.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteUser(user.ID, index)}></span>
                      </td>
                    {/* </HasRole> */}
                    </tr>
                )) :
                (
                  <tr>
                    <td colSpan="15" className="text-center">{responseMessage}</td>
                  </tr>
                )
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
