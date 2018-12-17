import React from 'react';
import { withFormsy } from 'formsy-react';

class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue || '',
      firstCalled: true,
    };
  }
  componentDidMount() {
    this.props.setValue(this.props.defaultValue)
  }
  onChange(value) {
    this.props.setValue(value)
    this.setState({value});
    this.props.onChange && this.props.onChange(value);
  }
  renderError() {
    if(this.props.showRequired()) {
      return `${this.props.display} is required.`;
    } else if(!this.props.isValid()) {
      return this.props.getErrorMessage();
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.defaultValue && !this.state.value && this.state.firstCalled){
      this.setState({value : this.props.defaultValue,firstCalled:false});
      this.props.setValue(this.props.defaultValue);
    }
  }
  render() {
    const { name, type, placeholder, containerClass, className, onBlur, defaultValue, children } = this.props;
    return (
      <div className={containerClass}>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={`input-text block ${className} ${this.props.isFormSubmitted() && (this.props.showRequired() || !this.props.isValid()) ? 'error' : ''}`}
          onChange={e => this.onChange(e.target.value)}
          onBlur={e => onBlur && onBlur(e.target.value)}
          value= {this.state.value}
          required={this.props.required ? true : false}
          />
        <span className="error">{this.props.isFormSubmitted() && this.renderError()}</span>
        {children}
      </div>
    )
  }
}

export default withFormsy(Input);
