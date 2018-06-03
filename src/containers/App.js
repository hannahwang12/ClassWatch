import React, { Component } from 'react';
import background from '../assets/img/mountains.jpg';
import SearchContainer from '../containers/SearchContainer.js'
import '../assets/style/App.css';

class App extends Component {
  render() {
    return (
      <div className="home">
        <SearchContainer/>
      </div>
    );
  }
}

export default App;
