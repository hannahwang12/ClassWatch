import React, { Component } from 'react';

class SearchComponent extends Component {
  render() {
    return (
      <div className="search">
        <div className="title">ClassWatch.</div>
        <form>
          <input className="search" placeholder="enter a course code"/> 
        </form>
      </div>
    );
  }
}

export default SearchComponent;