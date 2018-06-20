import React, { Component } from 'react';

class RowComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rowData = this.props.row;
    if (rowData.reserve) {
      return (
        <tr className="reserveRow">
          <td><input className="checkbox" type="checkbox" name="sections[]" value={rowData.section} onClick={this.props.onCheck}/></td>
          <td colSpan="5" className="reserveCell">{rowData.reserve}</td>
          <td>{rowData.reserve_enrol_total} / {rowData.reserve_enrol_cap}</td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td><input className="checkbox" type="checkbox" name="sections[]" value={rowData.section} onClick={this.props.onCheck}/></td>
          <td>{rowData.section}</td>
          <td>{rowData.instructor}</td>
          <td>{rowData.days ? rowData.days.toString().replace(/,/g, ', ') : null}</td>
          <td>{rowData.time}</td>
          <td>{rowData.location}</td>
          <td>{rowData.enrol_total} / {rowData.enrol_cap}</td>
        </tr>
      );
    }
  }
}

export default RowComponent;