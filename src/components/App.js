import React, { Component } from 'react';

import Content from './Content';


class App extends Component {
  render() {
    const time = new Date().getHours();
    return (
      <h1>
        <Content />
      </h1>
    );
  }
}

export default App;
