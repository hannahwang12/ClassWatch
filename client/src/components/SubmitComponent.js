import React, { Component } from 'react';

class SubmitComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
    }
  }

  submit = () => {
    this.setState({submitted: true});
  }

  exit = (e) => {
    e.preventDefault();
    this.props.exit();
    this.setState({submitted: false});
  }

  render() {
    return (
      <div>
        <p className="close" onClick={this.props.exit}>×</p>
        <input name="email" type="text" placeholder="enter your email" autoComplete="off" style={{display: this.state.submitted?"none":"inline-block"}}></input>
        <p className="response-text" style={{display: this.state.submitted?"inline-block":"none"}}>Verification email sent!</p>
        <button onClick={this.submit} style={{display: this.state.submitted?"none":"inline-block"}}>Submit</button>
        <button onClick={this.exit} style={{display: this.state.submitted?"inline-block":"none"}}>Got it!</button>
      </div>
    );
  }


}

export default SubmitComponent;