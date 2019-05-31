import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import { API_END_POINT } from '../../config';

import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class FeaturedForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      featured: {
        hotel_id: '',
        package_id: '',
        start_date: '',
        end_date: '',
        starting_price: '',
      },
      gallery: '',
      hotels: [],
      packages: [],
      hotel: '',
      pckg: '',
      startDate: undefined,
      endDate: undefined,
      focusedInput: null,
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    // API_END_POINT = 'https://admin.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postFeatured = this.postFeatured.bind(this);
  }

  componentWillMount() {
    const { location } = this.props;
      if (location.state.selectedForm === 'featuredPackages'){
        this.fetchPackages();
      } else {
        this.fetchHotels();
      }
  }

  componentDidMount() {
    console.log('props',this.props);
    const { location, match } = this.props;
      if (match.params.featuredPackageId){
        axios.get(`${API_END_POINT}/api/fetchById/featuredPackage-fetchById/${match.params.featuredPackageId}`)
        .then(response => {
        this.setState({
          featured: response.data[0],
        }, () => {
          axios.get(`${API_END_POINT}/api/fetchById/packagePage-fetchById/${this.state.featured.package_id}`)
          .then((response) => {
            this.setState({
              pckg: response.data[0],
            })
          })
        })
      })}
      if(match.params.featuredHotelId) {
        axios.get(`${API_END_POINT}/api/fetchById/featuredHotel-fetchById/${match.params.featuredHotelId}`)
        .then(response => {
        this.setState({
          featured: response.data[0],
        }, () => {
          axios.get(`${API_END_POINT}/api/hotel/fetchById/${this.state.featured.hotel_id}`)
            .then((response) => {
              this.setState({
                hotel: response.data,
              })
            })
          })
        })
      }
    }

    fetchHotels() {
        axios.get(`${API_END_POINT}/api/hotel/fetch`)
        .then(response => {
        this.setState({
          hotels: response.data.items,
        })
      })
    }

    fetchPackages() {
        axios.get(`${API_END_POINT}/api/fetch/packagePage-fetch`)
        .then(response => {
        this.setState({
          packages: response.data.items,
        })
      })
    }

    setHotel = (selectedHotel) => {
    this.setState(prevState => ({
        hotel: selectedHotel,
        featured: {
            ...prevState.featured,
            hotel_id: selectedHotel.ID,
        },
        }));
    }

    setPackage = (selectedPackage) => {
    this.setState(prevState => ({
        pckg: selectedPackage,
        featured: {
            ...prevState.featured,
            package_id: selectedPackage.ID,
        },
        }));
    }

  setDescription(description) {
    const { featured } = this.state;
    featured.description = description.toString('html');
    this.setState({
      featured,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { featured } = this.state;
    featured[name] = value;
    this.setState({ featured });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postFeatured(event) {
    event.preventDefault();
    const { match, history, location } = this.props;
    const { loading, featured, gallery } = this.state;
        this.setState({ loading: true });

        // let imgArray = [];
        const fd = new FormData();
        // for (let index = 0; index < gallery.length; index += 1) {
        //   imgArray.push(gallery[index]);
        // }
        //   imgArray.forEach((img) => {
        //   fd.append('gallery_images', img);
        //   return img;
        // });

        if(match.params.featuredPackageId || match.params.featuredHotelId) {
          if(match.params.featuredPackageId) {
            let featuredPackage = _.omit(featured, ['hotel_id']);
            let requestBody = { 'featuredPackage' : JSON.stringify(featuredPackage)};
            axios.patch(`${API_END_POINT}/api/update/featuredPackage-update`, requestBody)
            .then((response) => {
                if (response.data && response.status === 200) {
                window.alert(response.data);
                this.setState({ loading: false });
                } else {
                window.alert('ERROR')
                this.setState({ loading: false });
                }
            });
            } else {
              let featuredHotel = _.omit(featured, ['package_id'])
              let requestBody = { 'featuredHotel' : JSON.stringify(featuredHotel)};
              axios.patch(`${API_END_POINT}/api/update/featuredHotel-update`, requestBody)
              .then((response) => {
                  if (response.data && response.status === 200) {
                  window.alert(response.data);
                  this.setState({ loading: false });
                  } else {
                  window.alert('ERROR')
                  this.setState({ loading: false });
                  }
              });
            }
          }
        else {
            if(location.state.selectedForm === 'featuredHotels') {
                let featuredHotel = _.omit(featured, ['package_id'])
                let requestBody = { 'featuredHotel' : JSON.stringify(featuredHotel)};
                    axios.post(`${API_END_POINT}/api/save/featuredHotel-save`, requestBody)
                    .then((response) => {
                        if (response.data && response.status === 200) {
                        window.alert(response.data);
                        this.setState({ loading: false });
                        } else {
                        window.alert('ERROR')
                        this.setState({ loading: false });
                        }
                    })
                    .catch((error) => {
                        this.setState({
                            loading: false,
                        });
                    window.alert('Failure: Some issue has occured.')
                    });
                } else {
                    let featuredPackage = _.omit(featured, ['hotel_id']);
                    let requestBody = { 'featuredPackage' : JSON.stringify(featuredPackage)};
                        axios.post(`${API_END_POINT}/api/save/featuredPackage-save`, requestBody)
                        .then((response) => {
                        if (response.data && response.status === 200) {
                        window.alert(response.data);
                        this.setState({ loading: false });
                        } else {
                        window.alert('ERROR')
                        this.setState({ loading: false });
                        }
                    })
                    .catch((error) => {
                        this.setState({
                            loading: false,
                        });
                    window.alert('Failure: Some issue has occured.')
                    });
                }
    }
}

  render() {
    const {
      loading,
      featured,
      description,
      hotel,
      hotels,
      pckg,
      packages,
      startDate,
      endDate,
      focusedInput,
    } = this.state;
    const { location } = this.props;
    const selectedFormName = _.startCase(this.props.location.state.selectedForm);
    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
      INLINE_STYLE_BUTTONS: [
        {
          label: 'Bold',
          style: 'BOLD',
          className: 'custom-css-class',
        },
        {
          label: 'Italic',
          style: 'ITALIC',
        },
        {
          label: 'Underline',
          style: 'UNDERLINE',
        },
      ],
      BLOCK_TYPE_DROPDOWN: [
        {
          label: 'Normal',
          style: 'unstyled',
        },
        {
          label: 'Large Heading',
          style: 'header-three',
        },
        {
          label: 'Medium Heading',
          style: 'header-four',
        },
        {
          label: 'Small Heading',
          style: 'header-five',
        },
      ],
      BLOCK_TYPE_BUTTONS: [
        {
          label: 'UL',
          style: 'unordered-list-item',
        },
        {
          label: 'OL',
          style: 'ordered-list-item',
        },
      ],
    };
    console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          <div className="col-md-2 col-sm-2">
          
            </div>
            <div className="col-md-10 col-sm-10">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter <span style={{textTransform: 'capitalize'}}>{selectedFormName}</span> Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postFeatured}
                  >
                {location.state.selectedForm === 'featuredPackages' ?
                  <div className="form-group row">
                    <label className="control-label col-md-3 col-sm-3">Package</label>
                    <div className="col-md-6 col-sm-6">
                        <Select
                            name="package_id"
                            value={pckg}
                            onChange={value => this.setPackage(value)}
                            options={packages}
                            valueKey="id"
                            labelKey="package_title"
                            clearable={false}
                            backspaceRemoves={false}
                            required
                        />
                    </div>
                </div>
                  :
                  null
                }

                {location.state.selectedForm === 'featuredHotels' ?
                  <div className="form-group row">
                    <label className="control-label col-md-3 col-sm-3">Hotel</label>
                    <div className="col-md-6 col-sm-6">
                        <Select
                            name="hotel_id"
                            value={hotel}
                            onChange={value => this.setHotel(value)}
                            options={hotels}
                            valueKey="id"
                            labelKey="name"
                            clearable={false}
                            backspaceRemoves={false}
                            required
                            />
                        </div>
                    </div>
                      :
                    null
                }

                <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Starting Price
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="number"
                          name="starting_price"
                          className="form-control"
                          value={featured.starting_price}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Date Range</label>
                      <div className="col-md-6 col-sm-6">
                        <DateRangePicker
                            startDate={featured.start_date ? moment(featured.start_date) : startDate}
                            endDate={featured.end_date ? moment(featured.end_date) : endDate}
                            startDateId="date_input_start"
                            endDateId="date_input_end"
                            onDatesChange={({ startDate: dateStart, endDate: dateEnd }) => (
                            this.setState({
                                startDate: dateStart,
                                endDate: dateEnd,
                            }, () => {
                                this.setState(prevState => ({
                                    featured: {...prevState.featured, start_date: this.state.startDate, end_date: this.state.endDate},
                                }))
                            }))}
                            focusedInput={focusedInput}
                            onFocusChange={input => this.setState({ focusedInput: input })}
                            required
                        />
                      </div>
                    </div>

                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-12 col-sm-12 text-center offset-md-3">
                        <Button
                          className={`btn btn-success btn-lg ${loading ? 'disabled' : ''}`}
                        >
                          <i
                            className={`fa fa-spinner fa-pulse ${loading ? '' : 'hidden'}`}
                          /> Submit
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

