import React, { Component, PropTypes } from 'react';

import Demo from './Demo';

const propTypes = {
  message: PropTypes.object.isRequired,
};

class App extends Component {
  render() {
    const { messageString } = this.props.message;

    return (
      <h1>
        <div id="horizontal-3">
          <Demo
            defaultValue={[50]}
            orientation={'horizontal'}
            handleClassName={'handle'}
            handleActiveClassName={'active'}
            barClassName={'bar'}
            withBars
          />
        </div>

      </h1>
    );
  }
}

App.propTypes = propTypes;

export default App;
