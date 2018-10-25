import React, { Component } from 'react';
import './App.css';
import {FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import axios from 'axios';
const demo = {
    user:"1",
    system:"NOAH",
    Tasks:["This is the first question: find the most expensive listing in New York.", "This is the second question", "This is the third one."]
}

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
           states:[],
           welcome: true,
           prompt: false,
           index: 0,
           originalStates:[],
           startTime:0
       }
       this.fillUser = this.fillUser.bind(this);
       this.handleUser = this.handleUser.bind(this);
       this.handleAnswer = this.handleAnswer.bind(this);
       this.submitAnswer = this.submitAnswer.bind(this);
       this.continueTasks = this.continueTasks.bind(this);
       this.showQuestion = this.showQuestion.bind(this);
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
                let currentTaskSet = [];

                console.log(resData.warmUp);

                resData.warmUp.map((q)=>{
                    currentTaskSet.push(["Warm Up Session", q])
                })
                tasks.push(currentTaskSet);

                this.state.states[0] = resData.warmUp.length;

                 currentTaskSet = [];

                resData.task1.dataset.map((q)=>{
                    currentTaskSet.push([resData.task1.system, q])
                })
                tasks.push(currentTaskSet);



                 currentTaskSet = [];

                this.state.states[1] = resData.task1.dataset.length;

                resData.task2.dataset.map((q)=>{
                    currentTaskSet.push([resData.task2.system, q])
                })
                tasks.push(currentTaskSet);

                this.state.states[2] = resData.task1.dataset.length;

                const originalStates = this.state.states.slice();
                // console.log(tasks);
                this.setState({originalStates:originalStates});
                console.log("original states have been changed");

                console.log("I am setting original states");

                this.state.tasks = tasks;
                this.state.numberOfTasks = tasks.length;


                // this.setState({welcome:false});
                this.setState({prompt:true});
                console.log(this.state.states);

                // this.setState((state, props)=>({
                //     currentTask: state.currentTask + 1
                // }))


            })


    }

    showQuestion(e) {
        e.preventDefault();
        console.log("Click the start but");
        const prompt = this.state.prompt;
        this.state.startTime = new Date().getTime()/1000;
        if(prompt==true){
            this.setState({prompt:false, welcome:false});
        }
    }

    handleAnswer(e){
        console.log(e.target.value);
        this.setState({response: e.target.value});
    }


    submitAnswer(e){
        e.preventDefault();
        const prompt = this.state.prompt;
        const welcome = this.state.welcome;
        const idx = this.state.index;
        const originalStates = this.state.originalStates;
        let states = this.state.states;

        let res = this.state.response;
        let seconds = new Date().getTime()/1000;
        let n = this.state.currentTask;


        let responses = this.state.responses;
        let tasks = this.state.tasks;
        console.log(idx);
        console.log(originalStates);
        console.log(states);

        responses.push(
            tasks[idx][originalStates[idx]-states[idx]]
                .concat([res, this.state.startTime, seconds])
        );
        console.log("aftercomp"+originalStates);

        console.log(responses);

        let x = states[idx];
        states[idx] = x-1;

        // alert("Answersubmitted");
        this.setState((state, props)=>({
            currentTask: n + 1,
            response: "",
            responses: responses,
            prompt:false,
            states: states
            // responses: state.responses.push(state.tasks[n].concat([res, seconds])),
        }))

        if(states[idx]==0){
            this.setState({welcome:true, prompt:true, index:idx+1});
            // index: index+1,
        } else {
            this.setState({prompt:true});
        }


    }

    continueTasks(e){
        e.preventDefault();
        console.log("you clicked continue");
    }

    // let survey = 0;
    render(){
        const userId = this.state.userId;
        const currentTask = this.state.currentTask;
        const Tasks = this.state.tasks;



        const answer = this.state.response;
        console.log("this is user ID"+userId);
        let main;

        const prompt = this.state.prompt;
        const states = this.state.states;
        const welcome = this.state.welcome;
        const index = this.state.index;
        const originalStates = this.state.originalStates;



        if(welcome==true && prompt==false && states[0]!=0){
            console.log("welfomccc");
            main = <Welcome userId={userId} fillUser={this.fillUser} handleUser={this.handleUser}/>;
        }
        else if(welcome==true && prompt==true && index==0){
            main = <WaitForNext showQuestion={this.showQuestion} prompt='Open the "flight" dataset in NOAH. Click Start to begin the warm up session.'/>;
        }
        else if(welcome==true && prompt==true && index==1) {
            main = <WaitForNext showQuestion={this.showQuestion} prompt="The warm up session is complete. We will now move on to the next phase of the study. Click ok to begin"/>;

        }
        else if(welcome==true && prompt==true && index==2) {
            main = <WaitForNext showQuestion={this.showQuestion} prompt="Next is the second trial"/>;
        }
        else if(welcome==true && prompt==true && index==3) {
            main = <WaitForNext prompt="End"/>;


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
            }
        // else if(welcome==true && prompt==true && states[1]!=0){
        //     main = <WaitForNext showQuestion={this.showQuestion}/>;
        //     console.log("Prompt is true");
        //     //prompt second taskset
        //     // prompt=false;
        // } else if(welcome==true && prompt==true && states[2]!=0){
        //     main = <WaitForNext showQuestion={this.showQuestion}/>;
        //     console.log("Prompt is true");
        //     //prompt third taskset
        //     // end and submit
        // }
        else if(welcome==false && prompt==true ){
            main = <WaitForNext showQuestion={this.showQuestion} prompt="next is a question"/>;
            console.log("Prompt is true");
            //prompt give prompt taskset
            // prompt=false;
        } else if(welcome==false && prompt==false){
            main=<Question
                number={Tasks[index][originalStates[index]-states[index]][0]}
                title={Tasks[index][originalStates[index]-states[index]][1]}
                answer={answer}
                handleAnswer={this.handleAnswer}
                submitAnswer={this.submitAnswer}
            />;
        }


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
                    <h1>Welcome to the Study. Please enter your participant no. (e.g. 1,2,3)</h1>
                    <FormControl
                        type="text"
                        value={props.userId}
                        onChange={props.fillUser}
                        placeholder={"Enter a Number"}
                    />
                </FormGroup>
                <Button bsStyle="primary" type="submit" className="Start">Confirm</Button>
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

function WaitForNext(props){
    return(
        <div>
            <h1>{props.prompt}</h1>
            <Button bsStyle="primary" onClick={props.showQuestion}>Start</Button>
        </div>

    )
}

export default App;




//[3,4,5]
//if(index value->0, index =1 or index 2){ show questionnaire, move value forward}
// else prompt questions by index and left questions.

// if(currentTask==0){
//     main=<Welcome userId={userId} fillUser={this.fillUser} handleUser={this.handleUser}/>;
// }
//
// else if(currentTask>Tasks.length){
//     main=<div>Thank you for your participation! <a href="http://garyperlman.com/quest/quest.cgi">Survey</a></div>;
//
//     const responses = this.state.responses;
//
//     let config = {
//         headers: {
//             "Content-Type":"application/json"
//         }
//     }
//     axios.post(serverIP+'/postData', {
//         user:userId,
//         responses:responses
//     }, config)
//         .then(function(response){
//             console.log(response);
//         })
//         .catch(function(error){
//             console.log(error);
//         });
//
//     // console.log(this.state.responses);
// }
//
// //fix the questionnaire
// else if(Tasks[currentTask-1][0]!=Tasks[currentTask][0]){
//     main=
//         <div>
//             <h1>Please fill up the questionnaire for the system you just used!</h1>
//             <div><a href="http://garyperlman.com/quest/quest.cgi">Survey</a></div>
//             <h1>After filling the survey please click the continue button</h1>
//             <div><Button bsStyle="primary" onClick={this.continueTasks}>Continue</Button></div>
//         </div>;
// }
//
// else{
//     main=<Question number={Tasks[currentTask-1][0]} title={Tasks[currentTask-1][1]} answer={answer} handleAnswer={this.handleAnswer} submitAnswer={this.submitAnswer} showQuestion={this.showQuestion}/>;
//     console.log(this.state.responses);
// }

// console.log("currentTask is "+currentTask.toString());
// console.log("currentIndex is "+index.toString());
// console.log("original states is "+originalStates);
// console.log("states is "+states);