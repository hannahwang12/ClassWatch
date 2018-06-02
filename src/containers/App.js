import React, { Component } from 'react';
import background from '../assets/img/mountains.jpg';
import SearchComponent from '../components/SearchComponent.js'
import '../assets/style/App.css';

class App extends Component {
  render() {
    return (
      <div className="home">
        <SearchComponent/>
      </div>
    );
  }
}

export default App;
