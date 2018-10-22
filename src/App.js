import React, { Component } from 'react';
import './App.css';
import {FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import axios from 'axios';
const demo = {
    user:"1",
    system:"NOAH",
    Tasks:["This is the first question", "This is the second question", "This is the third one."]
}
let stage = true;
class App extends Component {

    constructor(props) {
       super(props);
       this.state = {
           value:"",
           response:"",
           userId:"Fill a number",
           currentTask:0
       }
       this.fillUser = this.fillUser.bind(this);
       this.handleUser = this.handleUser.bind(this);
       this.handleAnswer = this.handleAnswer.bind(this);
       this.submitAnswer = this.submitAnswer.bind(this);
    }
    fillUser(e){
        e.preventDefault();
        console.log(e.target.value);
        this.setState({userId:e.target.value});
    }
    handleUser(e){
        // alert("welcome");
        e.preventDefault();

        this.setState((state, props)=>({
            currentTask: state.currentTask + 1
        }))
    }
    handleAnswer(e){
        console.log(e.target.value);

        this.setState({response: e.target.value});
    }
    submitAnswer(e){
        e.preventDefault();

        alert("Answersubmitted");
        this.setState((state, props)=>({
            currentTask: state.currentTask + 1
        }))
    }

    render(){
        const userId = this.state.userId;
        const currentTask = this.state.currentTask;
        const Tasks = demo.Tasks;
        const answer = this.state.response;
        console.log("this is user ID"+userId);
        let main;
        if(currentTask==0){
            main=<Welcome userId={userId} fillUser={this.fillUser} handleUser={this.handleUser}/>;
        }else if(currentTask>Tasks.length){
            main=<div>END</div>;
        }else{
            main=<Question number={currentTask} title={Tasks[currentTask-1]} answer={answer} handleAnswer={this.handleAnswer} submitAnswer={this.submitAnswer}/>;
        }

        console.log("currentTask is "+currentTask.toString());

        return(
            <div>
                <Background>
                    {main}
                </Background>
            </div>
            // <div>
            //     <input type="text" value={this.state.value} onChange={this.handleChange}/>
            //     <label>{this.state.value}</label>
            // </div>
        )
    }
}

function Welcome(props){
    return (
        <div>
            <form onSubmit={props.handleUser}>
                <FormGroup>
                    <h1>Welcome to the NOAH study</h1>
                    <FormControl
                        type="text"
                        value={props.userId}
                        onChange={props.fillUser}
                        // placeholder={"Enter Number"}
                    />
                </FormGroup>
                <Button bsStyle="primary" type="submit" className="Start">Start</Button>
            </form>
        </div>
    )
}

function Background(props){
    return(
        <header className={"App-header"}>
            {props.children}
        </header>
    )
}

function Question(props){
    return (
            <form onSubmit={props.submitAnswer}>
                <FormGroup>
                    <h1>{props.number}</h1>
                    <label>{props.title}</label>
                    <FormControl
                        type="text"
                        value={props.answer}
                        onChange={props.handleAnswer}
                    />
                </FormGroup>
                <Button bsStyle="primary" type="submit" value="Submit">Submit</Button>
            </form>
    )
}



{/*<input type="text" value={props.userId} onChange={props.fillUser}></input>*/}

//                     <FormControl
//                         type="text"
//                         value={props.value}
//                         placeholder="Enter number"
//                         onChange={props.handleChange}
//                     />

{/*<input type="submit" value="Submit"></input>*/}




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
//

//
// class Question extends Component {
//     constructor(props) {
//         super(props);
//         this.handleChange = this.handleChange.bind(this);
//     }
//
//     handleSubmit(e) {
//
//     }
//
//     handleChange(e) {
//         e.preventDefault();
//         this.props.response(e.target.value);
//     }
//
//     render(){
//
//         return(
//             <Background>
//                 <h1>{this.props.title}</h1>
//                 <form onSubmit={this.handleSubmit}>
//                     <label>Fill your response in the box below</label>
//                     <input type="text" value={this.props.response} onChange={this.handleChange}></input>
//                     <input type="submit" value="Submit"></input>
//                 </form>
//             </Background>
//         )
//
//     }
//
//
// }
//
// class App extends Component {
//     constructor(props){
//         super(props);
//         this.state = {title:"Hello world",response:"Who are you"};
//     }
//
//     render(){
//         const title = this.state.title;
//         return(
//             <Background>
//                 <Question title={title}>
//
//                 </Question>
//             </Background>
//         )
//     }
// }

// function WelcomePage(props){
//     return(
//         <h1>Welcome to NOAH Study</h1>
//         <form onSubmit=
//     )
// }


//
// function WelcomePage(props){
//     return (
//         <header className="App-header">
//             <h1>Welcome to NOAH study</h1>
//             <form onSubmit={props.handleSubmit}>
//                 <FormGroup>
//                     <ControlLabel>Please select your Participant number:</ControlLabel>
//                     <FormControl
//                         type="text"
//                         value={props.value}
//                         placeholder="Enter number"
//                         onChange={props.handleChange}
//                     />
//                 </FormGroup>
//                 <Button bsStyle="primary" type="submit" className="Start">Start</Button>
//             </form>
//         </header>
//     );
// }

//
// class App extends Component {
//
//     constructor(props){
//         super(props);
//         this.state = {
//             value: '',
//             quizzes: {},
//             isLoggedIn: false
//         };
//         this.handleChange = this.handleChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }
//
//     handleChange(e) {
//         this.setState({value:e.target.value});
//     }
//
//     handleSubmit(user) {
//         // e.preventDefault();
//         console.log("run submit function");
//         // console.log(e.props.value);
//         console.log(this);
//         axios.get(`http://localhost:5000/getQuestions/${user}`)
//             .then(res => {
//                 // console.log(res);
//                 console.log(res.data.task1.system);
//                 const quizzes = res.data;
//                 this.setState(state => ({
//                     quizzes: quizzes
//                 }))
//                 console.log(this.state.quizzes);
//             })
//     }
//
//
//     render() {
//
//         const isloggedIn = this.state.isLoggedIn;
//         let content;
//
//         if (isloggedIn){
//
//         }else{
//             content = <WelcomePage
//                 handleSubmit={(this.value) => this.handleSubmit}
//                 value={this.value}
//             />
//         }
//
//         return (
//             <div className="App">
//                 {content}
//             </div>
//         );
//     }
// }



export default App;