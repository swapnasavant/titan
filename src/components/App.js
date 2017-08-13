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
        {`${messageString} swapna!`}
        <Demo
          defaultValue={[0, 50, 100]}
          orientation={'horizontal'}
          withBars
        />
      </h1>
    );
  }
}

App.propTypes = propTypes;

export default App;
