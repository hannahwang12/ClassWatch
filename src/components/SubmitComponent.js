import React, { Component } from 'react';

class SubmitComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="submitDiv">
        <p onClick={this.props.exit}>X</p>
        <input name="email" type="text" placeholder="enter your email"></input>
        <button onClick={this.props.onSubmit}>Submit</button>
      </div>
    );
  }


}

export default SubmitComponent;