import React, { Component } from 'react';

import Content from './Content';


class App extends Component {
  render() {
    return (
      <h1>
        <div id="horizontal-3">
          <Content
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

export default App;
