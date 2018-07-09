import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
//import 'react-select/dist/react-select.css';

library.add(faSearch)

class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      term: "1189",
    };
  } 

  handleChange = (e) => {
		this.setState({value: e.target.value.toUpperCase()});
  }

  setLoading = (e) => {
    this.props.handleSubmit();    
    // Change something so users know it's searching
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitForm();
    }
  }

  submitForm = () => {
    var form = document.getElementById("searchForm");
    var button = form.ownerDocument.createElement('input');
    //make sure it can't be seen/disrupts layout (even momentarily)
    button.style.display = 'none';
    //make it such that it will invoke submit if clicked
    button.type = 'submit';
    //append it and click it
    form.appendChild(button).click();
    //if it was prevented, make sure we don't get a build up of buttons
    form.removeChild(button);
  }

  termChange = (term) => {
    this.setState({ term: term.value });
    this.props.changeSeason(term.value);
  }
  
  render() {

    const customStyles = {
      control: (base) => ({ ...base, 
                            position: 'fixed', 
                            height: '2em', 
                            top: '2em', 
                            left: '2em',
                            width: '15em',
                            fontFamily: 'Montserrat',
                            color: 'white', 
                            backgroundColor: 'rgba(0, 0, 0, 0.4)'}),
      option: (base, state) => { 
        return {...base,
                fontFamily: 'Montserrat',
                color: state.isSelected ? 'white' : 'rgba(255, 255, 255, 0.6)', 
                backgroundColor: state.isFocused ? 'black' : 'transparent' }},
      menu: (base, state) => ({ ...base, 
                                position: 'fixed',
                                top: '4.5em', 
                                left: '2em',
                                width: '15em',
                                backgroundColor: 'rgba(0, 0, 0, 0.4)' }),
      singleValue: base => ({ ...base, color: 'white' }),
      dropdownIndicator: (base, state) => {
        return {padding: '8',
                color: 'white',
                display: 'flex',
                boxSizing: 'border-box',
        }},
    };

    return (
      <div className="searchBar">
        <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe" display="none" frameBorder="0"></iframe>
        <form id="searchForm" action="http://localhost:8080/scrape" method="post" onSubmit={this.setLoading} onKeyPress={this.handleKeyPress} target="dummyframe" autoComplete="off">
          {/*<select name="term" onChange={this.props.changeSeason}>
            <option value="1179">Fall 2017</option>
            <option value="1181">Winter 2018</option>
            <option value="1185" selected>Spring 2018</option>
            <option value="1189">Fall 2018</option>
          </select>*/}
          <Select className="select-term"
                  name="term"
                  defaultValue={{value: '1189', label: 'Fall 2018'}}
                  onChange={this.termChange}
                  onKeyDown={this.onKeyDown}
                  isSearchable={false}
                  isClearable={false}
                  styles={customStyles}
                  options={[{value: '1179', label: 'Fall 2017'}, 
                            {value: '1181', label: 'Winter 2018'}, 
                            {value: '1185', label: 'Spring 2018'}, 
                            {value: '1189', label: 'Fall 2018'}]}/>
          <input name="course" type="text" className="search" placeholder="enter a course code" value={this.state.value} onChange={this.handleChange}/>
          {this.props.searching ? <div className="loader"></div> : <FontAwesomeIcon onClick={this.submitForm} className="searchIcon" icon="search" size="2x"/>}
        </form>
        
      </div>
    );
  }
}

export default SearchComponent;