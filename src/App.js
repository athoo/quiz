import React, { Component } from 'react';
import './App.css';
import {FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import axios from 'axios';
const demo = {
    user:"1",
    system:"NOAH",
    Tasks:["This is the first question: find the most expensive listing in New York.", "This is the second question", "This is the third one."]
}
let stage = true;
const serverIP = "http://localhost:5000"
class App extends Component {

    constructor(props) {
       super(props);
       this.state = {
           value:"",
           response:"",
           userId:"",
           currentTask:0,
           warmUpQuestions:[],
           warmUpLeft:0,
           task1:[],
           task1Left:0,
           system1:"",
           task2:[],
           task2Left:0,
           system2:"",
           numberOfTasks:0,
           tasks:[],
           responses:[],
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

        let user = this.state.userId;
        axios.get(serverIP+`/getQuestions/${user}`)
            .then(res => {
                console.log(res.data);

                let resData = res.data;
                let tasks = [];

                resData.warmUp.map((q)=>{
                    tasks.push(["Warm Up Session", q])
                })
                resData.task1.dataset.map((q)=>{
                    tasks.push([resData.task1.system, q])
                })
                resData.task2.dataset.map((q)=>{
                    tasks.push([resData.task2.system, q])
                })

                console.log(tasks);

                this.state.tasks = tasks;
                this.state.numberOfTasks = tasks.length;


                // this.state.warmUpQuestions = res.data.warmUp;
                // this.state.warmUpLeft = res.data.warmUp.length;
                // this.state.system1 = res.data.task1.system;
                // this.state.task1 = res.data.task1.dataset;
                // this.state.task1Left = res.data.task1.length;
                // this.state.system2 =res.data.task2.system;
                // this.state.task2 = res.data.task2.dataset;
                // this.state.task2Left = res.data.task2.length;

                this.setState((state, props)=>({
                    currentTask: state.currentTask + 1
                }))
            })


    }
    handleAnswer(e){
        console.log(e.target.value);

        this.setState({response: e.target.value});


    }
    submitAnswer(e){
        e.preventDefault();

        let res = this.state.response;
        let seconds = new Date().getTime()/1000;
        let n = this.state.currentTask;



        let responses = this.state.responses;
        let tasks = this.state.tasks;
        responses.push(tasks[n-1].concat([res, seconds]));


        // alert("Answersubmitted");
        this.setState((state, props)=>({
            currentTask: n + 1,
            response: "",
            responses: responses,
            // responses: state.responses.push(state.tasks[n].concat([res, seconds])),
        }))
    }

    render(){
        const userId = this.state.userId;
        const currentTask = this.state.currentTask;
        const Tasks = this.state.tasks;


        const answer = this.state.response;
        console.log("this is user ID"+userId);
        let main;
        if(currentTask==0){
            main=<Welcome userId={userId} fillUser={this.fillUser} handleUser={this.handleUser}/>;
        }else if(currentTask>Tasks.length){
            main=<div>Thank you for your participation! <a href="http://garyperlman.com/quest/quest.cgi">Survey</a></div>;

            const responses = this.state.responses;

            let config = {
                headers: {
                    "Content-Type":"application/json"
                }
            }
            axios.post(serverIP+'/postData', {
                user:userId,
                responses:responses
            }, config)
                .then(function(response){
                    console.log(response);
                })
                .catch(function(error){
                    console.log(error);
                });

            // console.log(this.state.responses);
        }else{
            main=<Question number={Tasks[currentTask-1][0]} title={Tasks[currentTask-1][1]} answer={answer} handleAnswer={this.handleAnswer} submitAnswer={this.submitAnswer}/>;
            console.log(this.state.responses);
        }

        console.log("currentTask is "+currentTask.toString());

        return(
            <div>
                <Background>
                    {main}
                </Background>
            </div>
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
                        placeholder={"Enter a Number"}
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




export default App;