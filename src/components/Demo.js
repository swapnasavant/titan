import React, { Component, PropTypes } from 'react';

import Slider from './Slider';

const propTypes = {
  message: PropTypes.object.isRequired,
};

class Demo extends Component {

  constructor(props) {
    super();
    this.state = {
      value: props.defaultValue,
    };
  }

  onChange(value) {
  this.setState({ value: value });
  }

  render() {
    return (
      <h1>
        <Slider
          className={`${this.props.orientation}-slider`}
          pearling
          minDistance={10}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
        />
      </h1>
    );
  }
}

Demo.propTypes = propTypes;

export default Demo;
