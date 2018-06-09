import React, { Component } from 'react';

class RowComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rowData = this.props.row;
    return (
      <tr>
        <td><input type="checkbox"/></td>
        <td>{rowData.section}</td>
        <td>{rowData.instructor}</td>
        <td>{rowData.days}</td>
        <td>{rowData.time}</td>
        <td>{rowData.location}</td>
        <td>{rowData.enrol_total} / {rowData.enrol_cap}</td>
      </tr>
    );
  }
}

export default RowComponent;