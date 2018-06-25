import React, { Component } from 'react';

class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  handleChange = (e) => {
		this.setState({value: e.target.value.toUpperCase()});
  }
  
  render() {
    return (
      <div className="searchBar">
        <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe" display="none" frameBorder="0"></iframe>
        <form action="http://localhost:8080/scrape" method="post" onSubmit={this.props.handleSubmit} target="dummyframe" autoComplete="off">
          <input name="course" type="text" className="search" placeholder="enter a course code" value={this.state.value} onChange={this.handleChange}/>
        </form>
        {this.props.searching ? <div className="loader"></div> : null}
      </div>
    );
  }
}

export default SearchComponent;