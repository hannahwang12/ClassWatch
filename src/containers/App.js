import React, { Component } from 'react';
import axios from 'axios';
import background from '../assets/img/mountains.jpg';
import SearchContainer from '../containers/SearchContainer.js'
import ResultsContainer from '../containers/ResultsContainer.js'
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
		//make a request to get back scraped data
		setTimeout(function () { 
			axios.get("http://localhost:8080/data").then(response => {
        console.log(response.data);
        this.results = response.data;
        this.setState({searched: true});
      }); 
		}.bind(this), 8 * 1000);
	}

  render() {
    return (
      <div className="home">
        {this.state.searched ? null : <SearchContainer handleSubmit={this.handleSubmit}/>}
        {this.state.searched? <ResultsContainer results={this.results}/> : null}
      </div>
    );
  }
}

export default App;
