import React, { Component, PropTypes } from 'react';

const propTypes = {
  percentage: PropTypes.string,
  vertical: PropTypes.bool,
  srcOver: PropTypes.string,
  srcUnder: PropTypes.string,
  controls: PropTypes.bool,
  styles: PropTypes.object,
};

class ImageCompare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentage: props.percentage || 1,
    };

    this.dragger = this.dragger.bind(this);
  }

  dragger() {
    this.setState({
      percentage: this.slider.value,
    });
  }

  render() {
    const { percentage } = this.state;
    const { vertical, srcOver, srcUnder, controls, styles } = this.props;

    return (
      <div className="comparison">
        <figure>
          <img src={srcOver} alt="" width="100%"/>
          { !vertical &&
            <div
              style={{
                width: `${percentage}%`,
                backgroundImage: `url(${srcUnder})`,
                ...styles,
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
          { vertical &&
            <div
              style={{
                height: `${percentage}%`,
                backgroundImage: `url(${srcUnder})`,
                ...styles,
              }}
              className="compare-controls"
            >
              { controls &&
              <input
                type="range"
                orient="vertical"
                min="0"
                max="100"
                value={percentage}
                ref={(c) => { this.slider = c; }}
                onChange={this.dragger}
              />
            }
              <div className="tooltip-item tooltip-item-1" data-header-text="pos-item-1" />
            </div>
         }
        </figure>
      </div>
    );
  }

}

ImageCompare.propTypes = propTypes;

export default ImageCompare;
