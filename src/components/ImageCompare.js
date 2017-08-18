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
             <div className="fff">
               <svg width="100" height="100" viewBox="0 0 100 100">
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
