/* global document */
import React, { Component, PropTypes } from 'react';

const propTypes = {
  id: PropTypes.string,
  percentage: PropTypes.string,
  vertical: PropTypes.bool,
  srcOver: PropTypes.string,
  srcUnder: PropTypes.string,
  controls: PropTypes.bool,
  styles: PropTypes.object,
  trace: PropTypes.bool,
};

class ImageOverlap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentage: props.percentage || 50,
    };

    this.dragger = this.dragger.bind(this);
  }

  componentDidUpdate() {
    const { percentage } = this.state;
    let ahead = percentage >= 50 ? parseInt(percentage, 10) + 20 : parseInt(percentage, 10) - 20;
    ahead = ahead >= 100 ? 100 : ahead;
    document.getElementById('specs').style.width = `${ahead}%`;
  }

  dragger() {
    this.setState({
      percentage: this.slider.value,
    });
  }

  render() {
    const { percentage } = this.state;
    const { id, vertical, srcOver, srcUnder, controls, trace } = this.props;

    return (
      <div className="comparison">
        <figure>
          <img src={srcOver} className={`${trace ? 'perspective' : ''}`} alt="" width="100%" />
          { trace &&
            <div
              id={id}
              style={{
                width: `${percentage}%`,
                backgroundImage: `url(${srcUnder})`,
              }}
              className="compare-controls abcd-cover perspective"
            />
         }
          { !vertical &&
            <div
              style={{
                width: `${percentage}%`,
                backgroundImage: `url(${srcUnder})`,
              }}
              className="compare-controls abcd-cover"
            >
              { controls &&
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={percentage}
                  ref={(c) => { this.slider = c; }}
                  onChange={this.dragger}
                />
             }
            </div>
         }
        </figure>
      </div>
    );
  }

}

ImageOverlap.propTypes = propTypes;

export default ImageOverlap;
