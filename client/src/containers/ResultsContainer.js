import React, { Component } from 'react';
import RowComponent from '../components/RowComponent.js';
import SubmitComponent from '../components/SubmitComponent.js';
import SearchComponent from '../components/SearchComponent.js';

class ResultsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitDialog: "none",
    }
  }

  componentWillReceiveProps(newProps) {
      if (newProps.clickOut) {
        this.setState({ submitDialog: "none" });
      }
  }

  watchClasses = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ submitDialog: "block" });
  }

  exitSubmit = (e) => {
    if (this.state.submitDialog == "block") {
      this.setState({ submitDialog: "none" });
    }
  }

  clickDialog = (e) => {
    e.stopPropagation();
  }

  get_season(term) {
    const season_num = term.charAt(3);
    if (season_num === '1') {
      return 'Winter';
    } else if (season_num === '5') {
      return 'Spring';
    } else {
      return 'Fall';
    }
  }

  searchFunction = ( term, search ) => {
    this.props.searchQuery(term, search);
    var clist = document.getElementsByTagName("input");
    for (var i = 0; i < clist.length; ++i) { clist[i].checked = false; }
  }

  update_results(results) {
    let newResults = [];
    for (let i = 0; i < results.length; i++) {
      // if current section isn't reserve and next one exists and is reserve
      if (!results[i].reserve && results[i + 1] && results[i + 1].reserve) {
        var reserve_enrol_total = 0;
        var reserve_enrol_cap = 0;
        let temp_index = i + 1;
        while (results[temp_index] && results[temp_index].reserve) {
          reserve_enrol_cap += results[temp_index].reserve_enrol_cap;
          reserve_enrol_total += results[temp_index].reserve_enrol_total;
          temp_index++;
        }
        newResults.push(results[i]);
        if (results[i].enrol_cap - reserve_enrol_cap > 0) {
          newResults.push({
            section: `${results[i].section} RES0`,
            reserve: 'Not reserved',
            reserve_enrol_cap: results[i].enrol_cap - reserve_enrol_cap,
            reserve_enrol_total: results[i].enrol_total - reserve_enrol_total,
            instructor: results[i].instructor,
            time: results[i].time,
            days: results[i].days,
            date: results[i].date,
          });
        }
      } else {
        newResults.push(results[i]);
      }
    }
    return newResults;
  }

  render() {
    const results = this.props.results;
    const newResults = this.update_results(results);
    const course_name = results[0].course_code;
    const term = results[0].term;
    const season = this.get_season(term);
    const year = `201${term.charAt(2)}`
    if (results[0].course_title) {
      return (
        <div className="resultsPage">
          <div ref={(el) => {
              if (el) {
                el.style.setProperty('font-size', '0.8em', 'important');
                el.style.setProperty('padding', '1em', 'important');
              }
            }}>
            <SearchComponent searching={this.props.searching} searched={this.props.searched} handleSubmit={this.props.handleSubmit} changeSeason={this.props.changeSeason} searchQuery={this.searchFunction}/>
          </div>
          <div className="results">
            <h1>{results[0].course_code}</h1>
            <h2>{results[0].course_title} | {season} {year}</h2>
            <form action="/track" target="dummyframe" method="post">
              <table>
                <thead>
                  <tr>
                    <th>WATCH</th>
                    {/*<th style={term == '1189'? {display: 'block'}:{display: 'none'}}>WATCH</th>*/}
                    <th>Section</th>
                    <th>Instructor</th>
                    <th>Days</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Spots</th>
                  </tr>
                </thead>
                <tbody>
                    {newResults.map((elem) => <RowComponent row={elem} term={term == '1191'?'block':'none'}/>)}
                </tbody>
              </table>
              <button className="button" onClick={ this.watchClasses }>Watch</button>
              <iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe" display="none" frameBorder="0"></iframe>
              <input type="hidden" name="course_name" display="none" value={course_name}></input>
              <div className="overlay" style={{ display: this.state.submitDialog }}>
                <div className="submitDialog" style={{ display: this.state.submitDialog }} onClick={this.clickDialog}>
                  <SubmitComponent exit={this.exitSubmit}/>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div className="resultsPage">
          <div ref={(el) => {
                if (el) {
                  el.style.setProperty('font-size', '0.8em', 'important');
                  el.style.setProperty('padding', '1em', 'important');
                }
              }}>
            <SearchComponent searching={this.props.searching} searched={this.props.searched} handleSubmit={this.props.handleSubmit} changeSeason={this.props.changeSeason} searchQuery={this.searchFunction}/>
          </div>
          <div className="results">
            <h1>{results[0].course_code}</h1>
            <p>No classes found :(</p>
          </div>
        </div>
      );
    }
  }
}

export default ResultsContainer;