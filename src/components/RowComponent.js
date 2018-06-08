import React, { Component } from 'react';

class RowComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const index = this.props.index;
    const results = this.props.results;
    const rowData = results[index];
    return (
      <tr>
        <td></td>
        <td>{rowData.section}</td>
        <td>{rowData.instructor}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }
}

export default RowComponent;