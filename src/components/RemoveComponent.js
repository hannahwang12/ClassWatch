import React, { Component } from 'react';

class RemoveComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <form action="http://localhost:8080/remove" target="dummyframe" method="post">
          <input name="code" type="text" placeholder="enter your removal code" autoComplete="off" ></input>
          <button className="button" type="submit">Submit</button>          
        </form>
        <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe" display="none" frameBorder="0"></iframe>        
      </div>
    );
  }


}

export default RemoveComponent;