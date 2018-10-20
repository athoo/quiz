import React, { Component } from 'react';
import './App.css';
import {FormControl, FormGroup, ControlLabel, HelpBlock, Checkbox, Radio, Button} from 'react-bootstrap';
import axios from 'axios';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({value:e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("run submit function");
        console.log(this.state.value);
        axios.get(`http://localhost:5000/getQuestions/${this.state.value}`)
            .then(res => {
                console.log(res);
                console.log(res.data.task1.system);
            })
    }

    handleSubmit(e) {
        console.log(this.state.value);
    }

    render() {
    return (
      <div className="App">
        <header className="App-header">
              <h1>Welcome to NOAH study</h1>
            <form onSubmit={this.handleSubmit}>
              <FormGroup>
                  <ControlLabel>Please select your Participant number:</ControlLabel>
                  <FormControl
                      type="text"
                      value={this.state.value}
                      placeholder="Enter number"
                      onChange={this.handleChange}
                    />
                  <FormControl.Feedback />
              </FormGroup>
                <input bsStyle="primary" value="Start" type="submit">
            </form>
        </header>
      </div>
    );
  }
}

export default App;
