import React, { Component } from 'react';

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
	}

	handleChange = (e) => {
		this.setState({value: e.target.value.toUpperCase()});
	}

  render() {
    return (
      <div className="search">
        <div className="title">ClassWatch.</div>
        <form action="http://localhost:8080/scrape" method="post" onSubmit={this.handleSubmit} autocomplete="off">
          <input name="course" type="text" className="search" placeholder="enter a course code" value={this.state.value} onChange={this.handleChange}/> 
        </form>
      </div>
    );
  }
}

export default SearchContainer;