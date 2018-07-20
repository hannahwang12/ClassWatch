import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faChalkboardTeacher);
library.add(faCheck);
library.add(faEnvelope);
library.add(faTimes);

class HelpComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="overlay" style={{ display: this.props.display}}>
        <div className="helpModal" style={{ display: this.props.display}} onClick={function(e) {e.stopPropagation();}}>
          <div className="closeHelp" onClick={this.props.exit}>×</div>
          <p><FontAwesomeIcon icon="search" style={{fontSize: '20px', paddingLeft: '5px', paddingRight: '5px',}}/> Search for a course (e.g. ECON101, CS246E)</p>
          <p><FontAwesomeIcon icon="chalkboard-teacher" style={{fontSize: '20px', paddingLeft: '3px', paddingRight: '3px',}}/> View sections, instructors, locations, and enrollment numbers</p>
          <p><FontAwesomeIcon icon="check" style={{fontSize: '20px', paddingLeft: '5px', paddingRight: '5px',}}/> Select sections to watch</p>
          <p><FontAwesomeIcon icon="envelope" style={{fontSize: '20px', paddingLeft: '5px', paddingRight: '5px',}}/> Receive email notifications when spots are available</p>
          <p><FontAwesomeIcon icon="times" style={{fontSize: '20px', paddingLeft: '8px', paddingRight: '8px',}}/> Enter your removal code (found in email) to stop notifications</p>    
        </div>
      </div>
    );
  }


}

export default HelpComponent;