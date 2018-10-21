import React, { Component } from 'react';
import './App.css';
import {FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import axios from 'axios';

// class Question extends Component {
//     render() {
//         return (
//             <div><h1>{this.state}</h1>
//             <div>
//                 This is a new conponent
//             </div>
//             </div>
//         )
//     }
// }

// let userId;

function WelcomePage(props){
    return (
        <header className="App-header">
            <h1>Welcome to NOAH study</h1>
            <form onSubmit={props.handleSubmit}>
                <FormGroup>
                    <ControlLabel>Please select your Participant number:</ControlLabel>
                    <FormControl
                        type="text"
                        value={props.value}
                        placeholder="Enter number"
                        onChange={props.handleChange}
                    />
                </FormGroup>
                <Button bsStyle="primary" type="submit" className="Start">Start</Button>
            </form>
        </header>
    );
}


class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: '',
            quizzes: {},
            isLoggedIn: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({value:e.target.value});
    }

    handleSubmit(user) {
        // e.preventDefault();
        console.log("run submit function");
        // console.log(e.props.value);
        console.log(this);
        axios.get(`http://localhost:5000/getQuestions/${user}`)
            .then(res => {
                // console.log(res);
                console.log(res.data.task1.system);
                const quizzes = res.data;
                this.setState(state => ({
                    quizzes: quizzes
                }))
                console.log(this.state.quizzes);
            })
    }


    render() {

        const isloggedIn = this.state.isLoggedIn;
        let content;

        if (isloggedIn){

        }else{
            content = <WelcomePage
                handleSubmit={(this.value) => this.handleSubmit}
                value={this.value}
            />
        }

        return (
            <div className="App">
                {content}
            </div>
        );
    }
}



export default App;