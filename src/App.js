import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {FormControl, FormGroup, ControlLabel, HelpBlock, Checkbox, Radio, Button} from 'react-bootstrap';

class App extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: ''
        };
    }

    getValidationState() {
        const length = this.state.value.length;
        if (length <= 2) return 'success';
        else if (length > 2) return 'warning';
        return null;
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
        console.log(this);
    }

    render() {
    return (
      <div className="App">
        <header className="App-header">
              <h1>Welcome to NOAH study</h1>
            <form>
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
              <Button bsStyle="primary" type="submit" className="Start">Start</Button>
            </form>
        </header>
      </div>
    );
  }
}

export default App;
