import React, { Component } from 'react';
import background from '../assets/img/mountains.jpg';
import '../style/App.css';

class App extends Component {
  render() {
    return (
      <div className="home">
        <div className="title">ClassWatch.</div>
        <form>
          <input className="search" placeholder="enter a course code"/> 
        </form>
      </div>
    );
  }
}

export default App;
