import React, { Component } from 'react';

class RowComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.term);
    const rowData = this.props.row;
    if (rowData.reserve && rowData.date) {
      //console.log('date');
      return (
        <tr className="reserveRow">
          <td>
            <label className="container" style={{ display: this.props.term }}>
                <input className="checkbox" type="checkbox" name="sections[]" value={rowData.section}/>
                <span className="checkmark"></span>
            </label>
          </td>
          <td className="reserveCell">{rowData.reserve}</td>
          <td>{rowData.instructor}</td>
          <td>{rowData.days ? rowData.days.toString().replace(/,/g, ', ') : null} {rowData.date ? rowData.date[0] : null}</td>
          <td>{rowData.time}</td>
          <td>{rowData.location}</td>
          <td>{rowData.reserve_enrol_total} / {rowData.reserve_enrol_cap}</td>
        </tr>
      );
    } else if (rowData.reserve) {
      //console.log('reserve');
      return (
        <tr className="reserveRow">
          <td>
            <label className="container" style={{ display: this.props.term }}>
                <input className="checkbox" type="checkbox" name="sections[]" value={rowData.section}/>
                <span className="checkmark"></span>
            </label>
          </td>
          <td colSpan="5" className="reserveCell">{rowData.reserve}</td>
          <td>{rowData.reserve_enrol_total} / {rowData.reserve_enrol_cap}</td>
        </tr>
      );
    } else if (!rowData.enrol_cap) {
      return (
        <tr className="reserveRow">
          <td></td>
          <td></td>
          <td>{rowData.instructor}</td>
          <td>{rowData.days ? rowData.days.toString().replace(/,/g, ', ') : null} {rowData.date ? rowData.date[0] : null}</td>
          <td>{rowData.time}</td>
          <td>{rowData.location}</td>
          <td></td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>
            <label className="container" style={{ display: this.props.term }}>
                <input className="checkbox" type="checkbox" name="sections[]" value={rowData.section}/>
                <span className="checkmark"></span>
            </label>
          </td>
          <td>{rowData.section}</td>
          <td>{rowData.instructor}</td>
          <td>{rowData.days ? rowData.days.toString().replace(/,/g, ', ') : null} {rowData.date ? rowData.date[0] : null}</td>
          <td>{rowData.time}</td>
          <td>{rowData.location}</td>
          <td>{rowData.enrol_total} / {rowData.enrol_cap}</td>
        </tr>
      );
    }
  }
}

export default RowComponent;