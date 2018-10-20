import React, {Component} from 'react';
import {FormControl, FormGroup, ControlLabel, HelpBlock, Checkbox, Radio, Button} from 'react-bootstrap';


class Question extends Component {

    render(){
        return (
            <div className="Question">
                <header className="Question-header">
                    <h1>This is q1</h1>
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <ControlLabel>Fill your answer in the text box below:</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.value}
                                placeholder="Enter number"
                                onChange={this.handleChange}
                            />
                            <FormControl.Feedback />
                        </FormGroup>
                        <Button bsStyle="primary" type="submit" className="Start">Next Question</Button>
                    </form>
                </header>
            </div>
        )
    }
}