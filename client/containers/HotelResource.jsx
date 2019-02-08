import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import moment from 'moment';

import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class HotelResource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hotelResource: {
        image_type: '',
        hotel_id: '',
        description: '',
      },
      gallery: '',
      hotel: '',
      focusedInput: null,
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postHotelResource = this.postHotelResource.bind(this);
  }

  componentDidMount() {
    console.log('props', this.props)
    if (this.props.params.coverBannerId) {
      axios.get(`${this.endPoint}/api/coverbanner/fetchById/${this.props.params.coverBannerId}`)
        .then((response) => {
          this.setState({
            hotelResource: response.data[0]
          },() => {
            axios.get(`${this.endPoint}/api/hotel/fetchById/${this.state.hotelResource.hotel_id}`)
            .then((response) => {
              this.setState({
                hotel: response.data[0],
                startDate: moment(this.state.hotelResource.start_date),
                endDate: moment(this.state.hotelResource.end_date),
              })
            })
          });
        });
    }
  }

  componentWillMount() {
      this.setState(prevState => ({
        hotelResource: {
          ...prevState.hotelResource,
          hotel_id: this.props.params.hotelId,
        },
      }));
    }

  // setHotel(selectedHotel) {
  //   this.setState(prevState => ({
  //     hotel: selectedHotel,
  //     hotelResource: {
  //       ...prevState.hotelResource,
  //       hotel_id: selectedHotel.ID,
  //     },
  //   }));
  // }

  setDescription(description) {
    const { hotelResource } = this.state;
    hotelResource.description = description.toString('html');
    this.setState({
      hotelResource,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { hotelResource } = this.state;
    hotelResource[name] = value;
    this.setState({ hotelResource });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postHotelResource(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, hotelResource, gallery } = this.state;
        this.setState({ loading: true });

        let imgArray = [];
        const fd = new FormData();

        for (let index = 0; index < gallery.length; index += 1) {
          imgArray.push(gallery[index]);
        }
          imgArray.forEach((img) => {
          fd.append('resource_images', img);
          return img;
        });

        fd.append('hotelResource', JSON.stringify(hotelResource));

        if(this.props.params.coverBannerId) {
        axios.patch('/api/coverbanner/update', fd)
        axios.patch(`${this.endPoint}/api/coverbanner/update`, fd)
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
        else {
          axios.post(`${this.endPoint}/api/coverbanner/save`, fd)
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

  render() {
    const {
      loading,
      hotelResource,
      hotel,
      description,
      focusedInput,
    } = this.state;
    console.log(this.state);
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
                  <h2>Enter Hotel Resources</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postHotelResource}
                  >

                  <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="image_type"
                          value={hotel.image_type}
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
                          name="hotelResource"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required
                        />
                      </div>
                    </div>

                    {hotelResource.image
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                          style={{marginRight: '5px'}}
                          width="100"
                          className="img-fluid"
                          src={`${hotelResource.image.url}`}
                          alt="hotelResource"
                        />
                          
                        </div>
                      </div>
                      ) : null
                              }

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

