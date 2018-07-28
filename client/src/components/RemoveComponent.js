import React, { Component } from 'react';

class RemoveComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
    }
  }

  submit = () => {
    this.setState({ submitted: true });
  }

  exit = (e) => {
    e.stopPropagation();
    this.props.exit();
    this.setState({ submitted: false });
  }

  render() {
    return (
      <div className="overlay" style={{ display: this.props.display}}>
        <div className="removeDialog" style={{ display: this.props.display}} onClick={function(e) {e.stopPropagation();}}>
          <p className="close" onClick={this.exit}>×</p>      
          <form action="/remove" target="dummyframe" method="post">
            <input name="code" type="text" placeholder="enter your removal code" autoComplete="off" style={{display: this.state.submitted?"none":"inline-block"}}></input>
            <p className="response-text" style={{display: this.state.submitted?"inline-block":"none"}}>Removed class!</p>
            <button onClick={this.submit} style={{display: this.state.submitted?"none":"inline-block"}}>Remove</button>
            <button onClick={this.exit} style={{display: this.state.submitted?"inline-block":"none"}}>Got it!</button>
          </form>
          <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe" display="none" frameBorder="0"></iframe>        
        </div>
      </div>
    );
  }


}

export default RemoveComponent;