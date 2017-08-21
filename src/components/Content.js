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
    const img1 = '/assets/2.jpg'
    const img2 = '/assets/3.jpg'
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
      <div className="images-1">
          <svg className="sg1" width="100" height="100" viewBox="0 0 100 100">
            <g className="group" opacity="0.8">
              <g className="large">
                <path id="large" d="M41.25,40 L42.5,10 L43.75,40 L45, 41.25 L75,42.5 L45,43.75
                  L43.75,45 L42.5,75 L41.25,45 L40,43.75 L10,42.5 L40,41.25z " fill="gold" />
              </g>
              <g className="large-2" transform="rotate(45)">
              </g>
              <g className="small">
                <path id="small" d="M41.25,40 L42.5,25 L43.75,40 L45,41.25 L60,42.5 L45,43.75
                 L43.75,45 L42.5,60 L41.25,45 L40,43.75 L25,42.5 L40,41.25z" fill="gold" />
              </g>
            </g>
          </svg>
          <svg className="sg2" width="100" height="100" viewBox="0 0 100 100">
            <g className="group" opacity="0.8">
              <g className="large">
                <path id="large" d="M41.25,40 L42.5,10 L43.75,40 L45, 41.25 L75,42.5 L45,43.75
                  L43.75,45 L42.5,75 L41.25,45 L40,43.75 L10,42.5 L40,41.25z " fill="gold" />
              </g>
              <g className="large-2" transform="rotate(45)">
              </g>
              <g className="small">
                <path id="small" d="M41.25,40 L42.5,25 L43.75,40 L45,41.25 L60,42.5 L45,43.75
                 L43.75,45 L42.5,60 L41.25,45 L40,43.75 L25,42.5 L40,41.25z" fill="gold" />
              </g>
            </g>
          </svg>
      </div>
      </h1>
    );
  }
}

Content.propTypes = propTypes;

export default Content;
