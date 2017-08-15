import React, { Component, PropTypes } from 'react';

import ImageCompare from './ImageCompare';

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
    const img1 = '/assets/8.jpg'
    const img2 = '/assets/6.jpg'
    const compareStylesScroll = { borderRight: `3px dotted yellow` };
    const compareStylesManual = { borderBottom: `3px dotted yellow` };
    return (
      <h1>
        <ImageCompare
          srcOver={img1}
          srcUnder={img2}
          vertical={false}
          controls={true}
          styles={compareStylesManual}
        />
        <div className="images-1" />
      </h1>
    );
  }
}

Content.propTypes = propTypes;

export default Content;
