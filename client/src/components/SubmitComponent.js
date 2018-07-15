import React, { Component } from 'react';

class SubmitComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p onClick={this.props.exit}>×</p>
        <input name="email" type="text" placeholder="enter your email" autoComplete="off"></input>
        <button onClick={this.props.onSubmit}>Submit</button>
      </div>
    );
  }


}

export default SubmitComponent;