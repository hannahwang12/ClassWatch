import React, { Component } from 'react';
import RowComponent from '../components/RowComponent.js';
import SubmitComponent from '../components/SubmitComponent.js';
import SearchComponent from '../components/SearchComponent.js';

class ResultsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitDialog: "none",
      checkedCourses: new Array(),
    }
  }

  componentWillReceiveProps(newProps) {
      if (newProps.clickOut) {
        this.setState({ submitDialog: "none" });
      }
  }

  watchClasses = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ submitDialog: "block" });
  }

  exitSubmit = (e) => {
    if (this.state.submitDialog == "block") {
      this.setState({ submitDialog: "none" });
    }
  }

  clickDialog = (e) => {
    e.stopPropagation();
  }

  onSubmit = (e) => {
    this.setState({ submitDialog: "none" });
  }

  render() {
    console.log(results);
    const results = this.props.results;
    const course_name = results[0].course_code;
    if (results[0].course_title) {
      return (
        <div className="resultsPage">
          <SearchComponent searching={this.props.searching} searched={this.props.searched} handleSubmit={this.props.handleSubmit}/>
          <div className="results">
            <h1>{results[0].course_code}</h1>
            <h2>{results[0].course_title} | {results[0].term}</h2>
            <form action="http://localhost:8080/track" target="dummyframe" method="post">
              <table>
                <thead>
                  <tr>
                    <th>WATCH</th>
                    <th>Section</th>
                    <th>Instructor</th>
                    <th>Days</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Spots</th>
                  </tr>
                </thead>
                <tbody>
                    {results.map((elem) => <RowComponent row={elem} onCheck={this.onCheck}/>)}
                </tbody>
              </table>
              <button onClick={ this.watchClasses }>Watch</button>
              <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe" display="none" frameBorder="0"></iframe>
              <input type="hidden" name="course_name" display="none" value={course_name}></input>
              <div className="submitDialog" style={{ display: this.state.submitDialog }} onClick={this.clickDialog}>
                <SubmitComponent exit={this.exitSubmit} onSubmit={this.onSubmit}/>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div className="resultsPage">
          <SearchComponent searching={this.props.searching} searched={this.props.searched} handleSubmit={this.props.handleSubmit}/>
          <div className="results">
            <h1>{results[0].course_code}</h1>
            <p>No classes found :(</p>
          </div>
        </div>
      );
    }
  }
}

export default ResultsContainer;