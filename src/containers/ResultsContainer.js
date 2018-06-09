import React, { Component } from 'react';
import RowComponent from '../components/RowComponent.js';

class ResultsContainer extends Component {
  constructor(props) {
    super(props);
  }

 // createRows() {
  
 // }

  render() {
    const results = this.props.results;
    console.log(results);
    const course_title = results[0].course_title;
    return (
      <div>
        <h1>{course_title}</h1>
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