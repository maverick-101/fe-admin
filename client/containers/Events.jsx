import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import Broken from '../static/broken.png';
import Swal from 'sweetalert2';
import moment from 'moment'
import { API_END_POINT } from '../../config';

import HasRole from '../hoc/HasRole';

export default class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      activePage: 1,
      pages: 1,
      q: '',
      responseMessage: 'Loading Events...'
    }
    // API_END_POINT = 'https://admin.saaditrips.com';
  }
  componentWillMount() {
    axios.get(`${API_END_POINT}/api/fetch/event-fetch`)
      .then(response => {
        this.setState({
          events: response.data,
          pages: Math.ceil(response.data.length/10),
          responseMessage: 'No Events Found.'
        })
      })
      .catch((error) => {
        this.setState({
          // loading: false,
          responseMessage: 'No Events Found.'
        })
      })
  }
  deleteEvent(eventId, index) {
    if(confirm("Are you sure you want to delete this event?")) {
      axios.delete(`${API_END_POINT}/api/delete/event-deleteById/${eventId}`)
        .then(response => {
          if(response.status === 200) {
            Swal.fire({
              type: 'success',
              title: 'Deleted...',
              text: 'Event has been deleted successfully!',
            })
          }
          
          const events = this.state.events.slice();
          events.splice(index, 1);
          this.setState({ events });
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
              <h3>List of Events</h3>
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
                <Link to="/events_form">
                  <button type="button" className="btn btn-success marginTop">Add new Event</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>City</th>
                  <th>Location</th>
                  {/* <th>Address</th> */}
                  <th>Gathering</th>
                  {/* <th>Free Entry</th> */}
                  {/* <th>Description</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.events && this.state.events.length >= 1 ?
                  this.state.events.map((event, index) => (
                  <tr key={index}>
                  {/* {console.log(event.gallery[index])} */}
                    <td>{<img style={{height: '50px', width: '50px'}} src={event.gallery.length ? event.gallery[0].url : Broken} />}</td>
                    <td>{event.title}</td>
                    <td>{moment(event.start_date).format('DD-MMM-YYYY')}</td>
                    <td>{moment(event.end_date).format('DD-MMM-YYYY')}</td>
                    <td>{event.city ? event.city.name : ''}</td>
                    <td>{event.location ? event.location.name : ''}</td>
                    <td>{event.gathering_type}</td>
                    {/* <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td> */}
                    {/* <td>
                      <Link to={`${API_END_POINT}/area_resource/${event.ID}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td> */}
                    {/* <HasRole requiredRole={['admin']} requiredDepartment={['admin', 'sales']}> */}
                      <td>
                        <Link to={`/edit_event/${event.ID}`}>
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteEvent(event.ID, index)}></span>
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
