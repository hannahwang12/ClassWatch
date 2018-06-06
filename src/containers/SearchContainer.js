import React, { Component } from 'react';
import axios from 'axios';

class SearchContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: "",
		};
	}

	// on form submit, send the inputted data as a POST request to the web server
	handleSubmit = (e) => {
		console.log(this.state.value);
		//make a request to get back scraped data
		axios.get("http://localhost:8080/data").then(response => console.log(response.data));
	}

	handleChange = (e) => {
		this.setState({value: e.target.value.toUpperCase()});
	}

  render() {
    return (
      <div className="search">
				<iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe" display="none" frameBorder="0"></iframe>
        <div className="title">ClassWatch.</div>
        <form action="http://localhost:8080/scrape" method="post" onSubmit={this.handleSubmit} target="dummyframe" autoComplete="off">
          <input name="course" type="text" className="search" placeholder="enter a course code" value={this.state.value} onChange={this.handleChange}/> 
        </form>
      </div>
    );
  }
}

export default SearchContainer;