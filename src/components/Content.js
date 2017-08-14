import React, { Component, PropTypes } from 'react';

import Slider from './Slider';

const propTypes = {
  orientation: PropTypes.string,
  defaultValue: PropTypes.array,
};

class Content extends Component {

  constructor(props) {
    super();
    this.state = {
      value: props.defaultValue,
    };
  }

  onChange(value) {
    this.setState({ value });
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
        <div className="images-1" />
      </h1>
    );
  }
}

Content.propTypes = propTypes;

export default Content;
