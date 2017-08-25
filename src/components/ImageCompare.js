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
      percentage: props.percentage || 50,
    };

    this.dragger = this.dragger.bind(this);
  }

  componentDidUpdate() {
    const { percentage } = this.state;
    let ahead = percentage >= 50 ? parseInt(percentage, 10) + 20 : parseInt(percentage, 10) - 20;
    ahead = ahead >= 100 ? 100 : ahead;
    document.getElementById('obj').style.width = `${ahead}%`;
  }

  dragger() {
    this.setState({
      percentage: this.slider.value,
    });
  }

  render() {
    const { percentage } = this.state;
    const { vertical, srcOver, srcUnder, controls, styles, trace } = this.props;

    return (
      <div className="comparison">
        <figure>
          <img src={srcOver} alt="" width="100%" />
            { trace &&
              <div
                id="obj"
                style={{
                  width: `${percentage}%`,
                  backgroundImage: `url(${srcUnder})`,
                  ...styles,
                }}
                className="compare-controls abcd-cover"
              />
           }
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
        </figure>
      </div>
    );
  }

}

ImageCompare.propTypes = propTypes;

export default ImageCompare;
