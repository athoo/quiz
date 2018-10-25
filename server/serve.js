var express = require('express');
// var reload = require('express-reload');
var app = express();
var bodyParser = require('body-parser');


var path = __dirname + '/serve.js';

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());
// var Excel = require('exceljs')
//
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world')
})



const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const spreadsheet = '1t-vq8EQvkuS_Pm2muavFm_plxLsDJqiiZ1uVIsKNdYg';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';
let users = {};
let data = {};
let birdstrikes = [];
let airbnb = [];
let flight = [];
let currentUser = "";

let credentials;

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    credentials = JSON.parse(content)
    // authorize(credentials, readUserGroups);
    authorize(credentials, readUserGroups);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */


function readUserGroups(auth) {
    const sheets = google.sheets({version: 'v4', auth});

    let ranges = [
        'participants!A2:E',
        'flight',
        'birdstrikes',
        'airbnb'
    ]

    sheets.spreadsheets.values.batchGet({
        spreadsheetId:spreadsheet,
        ranges,
    }, (err, result) => {
        if(err){
            console.log(err);
        } else {
            const studyData = result.data.valueRanges
            let rows = studyData[0].values;

            rows.map((row) => {
                users[`${row[0]}`] = [`${row[1]}`, `${row[2]}`, `${row[3]}`, `${row[4]}`];
            })

            data['flight'] = [];
            data['birdstrikes'] = [];
            data['airbnb'] = [];

            rows = studyData[1].values.slice(1,);

            rows.map((row) => {
                data['flight'][row[0]-1] = row[1];
            })

            rows = studyData[2].values.slice(1,);

            rows.map((row) => {
                data['birdstrikes'][row[0]-1] = row[1];
            })

            rows = studyData[3].values.slice(1,);
            rows.map((row) => {
                data['airbnb'][row[0]-1] = row[1];
                // console.log(row[1]);
            })

            // let re = getQuestions(currentUser);
            //
            // return(re);
        }
    })
}

// get questions for a specific user
function getQuestions(user){
    let conditions = users[user];
    // console.log(conditions[0]);
    let i_1 = conditions[0];
    let d_1 = conditions[1];
    let i_2 = conditions[2];
    let d_2 = conditions[3];

    // console.log(data)
    return(
        {
            'user': user,
            'warmUp': data['flight'],
            'task1': {
                'system': i_1,
                'name': d_1,
                'dataset': data[d_1]
            },
            'task2': {
                'system': i_2,
                'name': d_2,
                'dataset': data[d_2]
            }
        }
    )
}

let userResponse = {}
//post user submitted data to a new sheet.
function postResponses(auth){

    const sheets = google.sheets({version: 'v4', auth});

    // let userResponse = {
    //     user:currentUser,
    //     responses:[['answer1', 'time1'],
    //     ['answer2', 'time2'],
    //     ['answer3', 'time3'],
    //     ['answer4', 'time4']]
    // }

    let sheetTitle = userResponse.user;

    let requests = [];

    requests.push({
        "addSheet": {
            "properties": {
                "title": sheetTitle,
                "sheetType": "GRID",
                "gridProperties": {
                    "rowCount": 50,
                    "columnCount": 10
                }
            }
        }
    });

    let batchUpdateRequest = {requests};


    let values = userResponse.responses;


    console.log("Print title and responses"+sheetTitle+values);
    let resource = {
        values,
    };

    console.log("Start post response")

    sheets.spreadsheets.batchUpdate(
        {
            spreadsheetId:spreadsheet,
            resource:batchUpdateRequest
        }, (err, response) => {
            if(err) {
                console.log(err);
                return(err);
            } else {
                sheets.spreadsheets.values.append({
                    spreadsheetId:spreadsheet,
                    range: sheetTitle,
                    valueInputOption:"USER_ENTERED",
                    resource: resource
                }, (err, response) => {
                    if(err){
                        return(err);
                    } else{
                        return('success');
                    }
                })
            }
        }
    )

}

// get data based on user id
app.get('/getQuestions/:userId', function (req, res) {

    currentUser = req.params.userId;
    // let r = authorize(credentials, readUserGroups);

    let re = getQuestions(currentUser);
    //
    // return(re);
    res.send(re);

})

// post data demo
app.post('/postData', function(req, res){

    console.log("This is the start of postData");
    userResponse['responses'] = req.body.responses;
    userResponse['user'] = req.body.user;

    console.log(userResponse);
    // console.log(req)
    authorize(credentials, postResponses);
    res.send("end")
    // res.send(postResponses());
    // res.send(res);
})

// app.use(reload(path));


app.listen(5000, () => console.log("listening on 5000"));
