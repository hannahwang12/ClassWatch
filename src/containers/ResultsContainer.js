import React, { Component } from 'react';
import RowComponent from '../components/RowComponent.js';

class ResultsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const results = this.props.results;
    console.log(results);
    return (
      <div>
        <h1>{results[0].course_code}</h1>
        <h2>{results[0].course_title}</h2>
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
            {results.map((elem) => <RowComponent row={elem}/>)}
          </tbody>
        </table>
      </div>
    );
  }


}

export default ResultsContainer;