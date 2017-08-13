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
          min={0}
          max={100}
          step={1}
          withBars
          onChange={this.onChange.bind(this)}
          defaultValue={[0, 50, 100]}
          orientation={'horizontal'}
          handleClassName={'handle'}
          handleActiveClassName={'active'}
          barClassName={'bar'}
        />
      </h1>
    );
  }
}

Demo.propTypes = propTypes;

export default Demo;
