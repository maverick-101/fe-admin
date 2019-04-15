import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';

export default class CityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      order: {
        name: '',
        province: '',
        views: '',
        image_type: '',
        description: '',
      },
      gallery: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postCity = this.postCity.bind(this);
  }

  // componentDidMount() {
    // const { match } = this.props;
    // if (match.params.cityId) {
    //   axios.get(`/api/order/${match.params.cityId}`)
    //     .then((response) => {
    //       this.setState({
    //         order: response.data,
    //         description: RichTextEditor.createValueFromString(response.data.description, 'html'),
    //       });
    //     });
    // }
  // }

  componentDidMount() {
    console.log('props',this.props);
      if (window.location.href.split('/')[3] === 'edit_city')
      axios.get(`${this.endPoint}/api/fetchById/order-fetchById/${match.params.cityId}`)
        .then((response) => {
          this.setState({
            order: response.data[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          });
        });
    }

  setDescription(description) {
    const { order } = this.state;
    order.description = description.toString('html');
    this.setState({
      order,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { order } = this.state;
    order[name] = value;
    this.setState({ order });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postCity(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, order, gallery } = this.state;
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

        fd.append('order', JSON.stringify(order));

        if(match.params.cityId) {
        // axios.patch('/api/order/update', fd)
        axios.patch(`${this.endPoint}/api/update/order-update`, fd)
          .then((response) => {
            if (response.data === 'Order Updated!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
        else {
          // axios.post('/api/order/save', fd)
          axios.post(`${this.endPoint}/api/save/order-save`, fd)
          .then((response) => {
            if (response.data === 'Order Saved!') {
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
      order,
      description,
    } = this.state;
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
                  <h2>Enter Order Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postCity}
                  >
                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Order Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={order.name}
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
                          value={order.province}
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
                          value={order.views}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Order Gallery</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          name="cover"
                          className="form-control"
                          onChange={this.handleImages}
                          multiple
                          required={order.gallery ? 0 : 1}
                        />
                      </div>
                    </div>

                    {order.gallery
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                        {order.gallery.map((image,index) => {
                          return (
                          <img key={index}
                          style={{marginRight: '5px'}}
                          width="100"
                          className="img-fluid"
                          src={`${image.url}`}
                          alt="cover"
                        />
                          )
                        })}
                          
                        </div>
                      </div>
                      ) : null
                              }

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Image Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="image_type"
                          value={order.image_type}
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

