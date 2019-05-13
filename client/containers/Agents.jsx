import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import Broken from '../static/broken.png';
import { API_END_POINT } from '../../config';

import HasRole from '../hoc/HasRole';

export default class Agents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      agents: [],
      activePage: 1,
      pages: 1,
      q: '',
      responseMessage: 'Loading Agents...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    axios.get(`${API_END_POINT}/api/fetch/agentPage-fetch`)
      .then(response => {
        this.setState({
          agents: response.data,
          pages: Math.ceil(response.data.length/10),
          responseMessage: 'No Agents Found...'
        })
      })
  }
  deleteAgent(agentId, index) {
    if(confirm("Are you sure you want to delete this agent?")) {
      axios.delete(`${API_END_POINT}/api/delete/agentPage-deleteById/${agentId}`)
        .then(response => {
          const agents = this.state.agents.slice();
          agents.splice(index, 1);
          this.setState({ agents });
        });
    }
  }
  handleSelect(page) {
    axios.get(`/api/agent?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          agents: response.data.items,
          activePage: page
        })
      })
  }
  handleSearch() {
    axios.get(`/api/agent?q=${this.state.q}`)
      .then((response) => {
        this.setState({
          agents: response.data.items,
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
              <h3>List of Agents</h3>
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
                <Link to="/agent_form">
                  <button type="button" className="btn btn-success marginTop">Add new Agent</button>
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
                  <th>Address</th>
                  {/* <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.agents && this.state.agents.length >= 1 ?
                  this.state.agents.map((agent, index) => (
                  <tr key={index}>
                    <td>{agent.ID}</td>
                    <td>{<img style={{height: '50px', width: '50px'}} src={agent.gallery.length ? agent.gallery[0].url : Broken} />}</td>
                    <td>{agent.name}</td>
                    <td>{agent.addresses.length ? `${agent.addresses[0].street} ${agent.addresses[0].address_type}` : ''}</td>
                    {/* <td>{agent.marla_size}</td>
                    <td>{agent.population}</td>
                    <td>{agent.lat}</td>
                    <td>{agent.lon}</td> */}
                    {/* <td>
                      <Link to={`/area_resource/${agent.id}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td> */}
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/edit_agent/${agent.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteAgent(agent.ID, index)}></span>
                      </td>
                    {/* </HasRole> */}
                  </tr>
                ))
                :
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
