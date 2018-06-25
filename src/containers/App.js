import React, { Component } from 'react';
import axios from 'axios';
import SearchComponent from '../components/SearchComponent.js';
import RemoveComponent from '../components/RemoveComponent.js';
import ResultsContainer from '../containers/ResultsContainer.js';
import '../assets/style/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      searched: false,
      clickOut: true,
    }
    this.results = null;
  }

  handleSubmit = (e) => {
    this.setState({searching: true});
    axios.get("http://localhost:8080/data").then(response => {
      console.log(response.data);
      this.results = response.data;
      this.setState({searching: false});
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
            <SearchComponent searching={this.state.searching} handleSubmit={this.handleSubmit}/>
          </div>}
        <div className="remove">
          <RemoveComponent />
        </div>        
        {this.state.searched ? <ResultsContainer searching={this.state.searching} searched={this.state.searched} results={this.results} handleSubmit={this.handleSubmit} clickOut={this.state.clickOut}/> : null}
      </div>
    );
  }
}

export default App;
