import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      test: {
        hotel_id: '',
        package_id: '',
        user_id: '',
        rating: '',
        comment: '',
      },
      gallery: '',
      description: RichTextEditor.createEmptyValue(),
    };
    // this.rteState = RichTextEditor.createEmptyValue();
    this.endPoint = 'https://api.saaditrips.com';
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postCity = this.postCity.bind(this);
  }

  componentDidMount() {
    console.log('props',this.props);
      if (window.location.href.split('/')[3] === 'edit_city')
      axios.get(`${this.endPoint}/api/fetchById/test-fetchById/${this.props.params.cityId}`)
        .then((response) => {
          this.setState({
            test: response.data[0],
            description: RichTextEditor.createValueFromString(response.data.description, 'html'),
          });
        });
    }

  setDescription(description) {
    const { test } = this.state;
    test.description = description.toString('html');
    this.setState({
      test,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { test } = this.state;
    test[name] = value;
    this.setState({ test });
  }

  handleImages = (event) => {
    this.setState({ gallery: event.target.files });
  }

  postCity(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, test, gallery } = this.state;
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

        fd.append('hotelRating', JSON.stringify(test));

        if(this.props.params.cityId) {
        // axios.patch('/api/test/update', fd)
        axios.patch(`${this.endPoint}/api/update/test-update`, fd)
          .then((response) => {
            if (response.data === 'Test Updated!') {
              window.alert(response.data);
              this.setState({ loading: false });
            } else {
              window.alert('ERROR')
              this.setState({ loading: false });
            }
          });
        }
        else {
          // axios.post('/api/test/save', fd)
          axios.post(`${this.endPoint}/api/save/hotelRating-save`, fd)
          .then((response) => {
            if (response.data && response.status === 200) {
              window.alert(response.data);
              this.setState({ loading: false });
            }
          }).catch((error) => {
              window.alert('Same error');
              this.setState({ loading: false })
          });
        }
        }

  render() {
    const {
      loading,
      test,
      description,
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
                  <h2>Enter Test Details</h2>
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
                      >User Id
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="user_id"
                          className="form-control"
                          value={test.user_id}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Package Id
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="package_id"
                          className="form-control"
                          value={test.package_id}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Hotel Id
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="hotel_id"
                          className="form-control"
                          value={test.hotel_id}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Rating
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="rating"
                          className="form-control"
                          value={test.rating}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Comment
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="comment"
                          className="form-control"
                          value={test.comment}
                          onChange={this.handleInputChange}
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

