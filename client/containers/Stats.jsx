import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import LineChart from '../components/LineChart'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import Doughnut from '../components/Doughnut'

export default class Area extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      areas: [],
      activePage: 1,
      pages: 1,
      q: '',
    }
  }
  componentWillMount() {
    // axios.get('/api/area')
    //   .then(response => {
    //     this.setState({
    //       areas: response.data.items,
    //       pages: Math.ceil(response.data.total/10)
    //     })
    //   })
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
          <div className="row">
            <div className="col-sm-4">
            </div>
            <div className="col-sm-2 pull-right">
            </div>
          </div>
          <div className="text-center space-2">
          </div>
          <div className="table-responsive">
            {/*<table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>City</th>
                  <th>Marla-Size(Sqft)</th>
                  <th>Population</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                </tr>
              </thead>
              <tbody>
                {this.state.areas.map((area, index) => (
                  <tr key={index}>
                    <td>{area.name}</td>
                    <td>{area.size}</td>
                    <td>{area.city.name}</td>
                    <td>{area.marla_size}</td>
                    <td>{area.population}</td>
                    <td>{area.lat}</td>
                    <td>{area.lon}</td>
                    <td>
                      <Link to={`/area_price_form/${area.id}`}>
                        <button type="button" className="btn btn-info btn-sm">Pricing</button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/area_trends/${area.id}`}>
                        <button type="button" className="btn btn-info btn-sm">Trends</button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/area_resource/${area.id}`}>
                        <button type="button" className="btn btn-info btn-sm">Resource</button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/edit_area/${area.id}`}>
                        <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                      </Link>
                    </td>
                    <td>
                      <span className="glyphicon glyphicon-trash" aria-hidden="true" onClick={() => this.deleteArea(area.id, index)}></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>*/}
            <div className = 'row space-3'>
              <div className='col-sm-6 pull-left'>
                <h3 className='space-1'>Listings in last week</h3>
                <LineChart className='chart' data={[1,2,3,4,5,6,7]} labels={['Mon','Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}/>
              </div>
              <div className='col-sm-6 '>
                <h3 className='space-1'>Rent/Sale Comparison</h3>
                <PieChart className='chart' data={[5,7]}/>
              </div>
            </div>
            <div className = 'row'>
              <div className='col-sm-6'>
                <h3 className='space-1'>Agencies registered</h3>
                <Doughnut className='chart' data={[1,2,3,4,5,6,7]} labels={['Mon','Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}/>
              </div>
              <div className='col-sm-6'>
                <h3 className='space-1'>Types Comparison</h3>
                <BarChart className='chart' data={[300,200,300]} labels={['Basic', 'Premium', 'Premium Plus']}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
