import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import Broken from '../static/broken.png';
import Swal from 'sweetalert2';

import HasRole from '../hoc/HasRole';

export default class Experiences extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      experiences: [],
      activePage: 1,
      pages: 1,
      q: '',
      responseMessage: 'Loading Experiences...'
    }
    this.endPoint = 'https://admin.saaditrips.com';
  }

  componentWillMount() {
    axios.get(`${this.endPoint}/api/fetch/experience-fetch`)
      .then(response => {
        this.setState({
          experiences: response.data,
          pages: Math.ceil(response.data.length/10),
          responseMessage: 'No Experiences Found...'
        })
      })
      .catch((error) => {
        this.setState({
          responseMessage: 'No Experiences Found...'
        })
      })
  }

  deleteExperience(experienceId, index) {
    if(confirm("Are you sure you want to delete this experience?")) {
      axios.delete(`${this.endPoint}/api/delete/experience-deleteById/${experienceId}`)
        .then(response => {
          if(response.status === 200) {
            Swal.fire({
              type: 'success',
              title: 'Deleted...',
              text: 'Experience has been deleted successfully!',
            })
          }
          
          const experiences = this.state.experiences.slice();
          experiences.splice(index, 1);
          this.setState({ experiences });
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
              <h3>List of Experiences</h3>
            </div>
            <div style={{marginTop: '20px'}} className="col-sm-4">
              <div className='input-group'>
                <input  className='form-control' type="text" name="search" placeholder="Enter keyword" value={this.state.q} onChange={(event) => this.setState({q: event.target.value})}/>
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div>
            </div>

            <div className="col-sm-2 pull-right">
                <Link to="/experiences_form">
                  <button type="button" className="btn btn-success marginTop">Add new Experience</button>
                </Link>
            </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>User</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                </tr>
              </thead>
              <tbody>
                {this.state.experiences && this.state.experiences.length >= 1 ?
                  this.state.experiences.map((experience, index) => (
                  <tr key={index}>
                    <td>{<img style={{height: '50px', width: '50px'}} src={experience.gallery.length ? experience.gallery[0].url : Broken} />}</td>
                    <td>{experience.experience_title}</td>
                    <td>{experience.user_name}</td>
                    <td>{experience.latitude}</td>
                    <td>{experience.longitude}</td>
                    <td>
                      <Link to={{
                          pathname: `/experiences_resource_form/${experience.ID}`,
                          state: { experienceId: experience.ID}
                        }}>
                        <button type="button" className="btn btn-info btn-sm">Resources</button>
                      </Link>
                    </td>
                    <td>
                      <Link to={{
                          pathname: `/experiences_rating_form/${experience.ID}`,
                          state: { experienceId: experience.ID}
                        }}>
                        <button type="button" className="btn btn-info btn-sm">Ratings</button>
                      </Link>
                    </td>
                      <td>
                        <Link to={`/edit_experiences/${experience.ID}`}>
                        {/* <Link to={{
                          pathname: `/edit_experiences/${experience.ID}`,
                          state: { experienceId: experience.ID}
                        }}> */}
                          <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true" style={{cursor: 'pointer'}} onClick={() => this.deleteExperience(experience.ID, index)}></span>
                      </td>
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
