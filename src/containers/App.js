import React, { Component } from 'react';
import axios from 'axios';
import SearchComponent from '../components/SearchComponent.js';
import ResultsContainer from '../containers/ResultsContainer.js';
import '../assets/style/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searched: false,
      clickOut: true,
    }
    this.results = null;
  }

  handleSubmit = (e) => {
    axios.get("http://localhost:8080/data").then(response => {
      console.log(response.data);
      this.results = response.data;
      this.setState({searched: true});
    }); 
	}

  clickOutside = (e) => {
      this.forceUpdate();
  }

  render() {
    return (
      <div className="home" onClick={this.clickOutside}>
        {this.state.searched ? null : 
          <div className="search">
            <div className="title">ClassWatch.</div>
            <SearchComponent handleSubmit={this.handleSubmit}/>
          </div>}
        {this.state.searched ? <ResultsContainer searched={this.state.searched} results={this.results} handleSubmit={this.handleSubmit} clickOut={this.state.clickOut}/> : null}
      </div>
    );
  }
}

export default App;
