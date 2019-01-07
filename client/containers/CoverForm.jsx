import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';

import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class CoverForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      cover: {
        image_type: '',
        hotel_id: '',
        agency_id: '',
        start_date: null,
        end_date: null,
        description: '',
      },
      gallery: '',
      hotels: [],
      hotel: '',
      startDate: null,
      endDate: null,
      focusedInput: null,
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postCity = this.postCity.bind(this);
  }

  // componentDidMount() {
    // const { match } = this.props;
    // if (match.params.cityId) {
    //   axios.get(`/api/cover/${match.params.cityId}`)
    //     .then((response) => {
    //       this.setState({
    //         cover: response.data,
    //         description: RichTextEditor.createValueFromString(response.data.description, 'html'),
    //       });
    //     });
    // }
  // }

  componentWillMount() {
    axios.get(`/api/hotel/fetch`)
        .then((response) => {
          this.setState({
            hotels: response.data,
          });
        });
  }

  setCity(selectedHotel) {
    this.setState(prevState => ({
      hotel: selectedHotel,
      location: {
        ...prevState.cover,
        hotel_id: selectedHotel.ID,
      },
    }));
  }

  componentDidMount() {
    // console.log('props',this.props);
    //   if (window.location.href.split('/')[3] === 'edit_city')
    //   axios.get(`/api/cover/fetchById/${this.props.params.cityId}`)
    //     .then((response) => {
    //       this.setState({
    //         cover: response.data[0],
    //         description: RichTextEditor.createValueFromString(response.data.description, 'html'),
    //       });
    //     });
    }

  setDescription(description) {
    const { cover } = this.state;
    cover.description = description.toString('html');
    this.setState({
      cover,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { cover } = this.state;
    cover[name] = value;
    this.setState({ cover });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postCity(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, cover, gallery } = this.state;
        this.setState({ loading: true });

        let imgArray = [];
        const fd = new FormData();
        for (let index = 0; index < gallery.length; index += 1) {
          imgArray.push(gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('gallery_images', img);
          return img;
        });

        fd.append('cover', JSON.stringify(cover));

        if(this.props.params.cityId) {
        axios.patch('/api/cover/update', fd)
          .then((response) => {
            if (response.data === 'cover Updated!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              history.push('/cities');
            }
          });
        }
        else {
          axios.post('/api/cover/save', fd)
          .then((response) => {
            if (response.data === 'cover Saved!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              history.push('/cities');
            }
          });
        }
        }

  render() {
    const {
      loading,
      cover,
      hotel,
      hotels,
      startDate,
      endDate,
      description,
      focusedInput,
    } = this.state;
    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
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
          label: 'Heading',
          style: 'header-four',
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
    // console.log(this.state);

    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">
          <div className="col-md-2 col-sm-2">
          
            </div>
            <div className="col-md-10 col-sm-10">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter cover Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postCity}
                  >
                    {/* <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >cover Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={cover.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Province
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="province"
                          className="form-control"
                          value={cover.province}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Views
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="views"
                          className="form-control"
                          value={cover.views}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div> */}

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
                            //   required
                            />
                          </div>
                        </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Agency Id
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="agency_id"
                          className="form-control"
                          value={cover.agency_id}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="image_type"
                          value={cover.image_type}
                          className="form-control custom-select"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="lounge">Lounge Image</option>
                          <option value="main_hall">Main Hall Image</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image Upload</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          name="cover"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Date Range</label>
                      <div className="col-md-6 col-sm-6">
                        <DateRangePicker
                            startDate={cover.startDate ? moment(cover.start_date) : startDate}
                            endDate={cover.end_date ? moment(cover.end_date) : endDate}
                            startDateId="date_input_start"
                            endDateId="date_input_end"
                            onDatesChange={({ startDate: dateStart, endDate: dateEnd }) => (
                            this.setState({
                                startDate: dateStart,
                                endDate: dateEnd,
                            }))}
                            focusedInput={focusedInput}
                            onFocusChange={input => this.setState({ focusedInput: input })}
                            required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Description</label>
                      <div className="col-md-6 col-sm-6">
                        <RichTextEditor
                          value={description}
                          toolbarConfig={toolbarConfig}
                          onChange={(e) => {
                            this.setDescription(e);
                          }}
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

