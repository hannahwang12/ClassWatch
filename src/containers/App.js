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

  render() {
    return (
      <div className="home">
        {this.state.searched ? null : 
          <div className="search">
            <div className="title">ClassWatch.</div>
            <SearchComponent handleSubmit={this.handleSubmit}/>
          </div>}
        {this.state.searched ? <ResultsContainer searched={this.state.searched} results={this.results} handleSubmit={this.handleSubmit}/> : null}
      </div>
    );
  }
}

export default App;
