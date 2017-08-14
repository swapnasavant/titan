import React, { Component } from 'react';

import Content from './Content';


class App extends Component {
  render() {
    const time = new Date().getHours();
    console.log(time);
    const arr = [`${time/24 *100}`];
    return (
      <h1>
        <div id="horizontal-3">
          <Content
            defaultValue={arr}
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
