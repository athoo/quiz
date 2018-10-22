var express = require('express')
var reload = require('express-reload')
var app = express()

var path = __dirname + '/serve.js'
var Promise = require('promise')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

            let re = getQuestions(currentUser);

            return(re);


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
    // console.log(users);
    // console.log(conditions);
    // console.log(data)
    return(
        {
            'user': user,
            'task1': {
                'system': i_1,
                'dataset': data[d_1]
            },
            'task2': {
                'system': i_2,
                'dataset': data[d_2]
            }
        }
    )
}


//post user submitted data to a new sheet.
function postResponses(auth){
    const sheets = google.sheets({version: 'v4', auth});

    let values = [
        ["5", "NOAH", 'xsv', 'dsadsa', 'sdddd']
    ];
    // console.log([{'addSheet':{} }]);
    const resource = {
        values,
    };

    let requests = [];

    requests.push({
        addSheet:{
            properties: {
                title:"New Sheet"
            }
        }
    })

    // const batchUpdateRequest = {requests};

    const batchUpdateRequest ={
        "requests": [{
        "addSheet": {
            "properties": {
                "title": "Expenses",
                "sheetType": "GRID",
                "gridProperties": {
                    "rowCount": 50,
                    "columnCount": 10
                }
            }
        }
    }],
    }
    console.log("This is "+batchUpdateRequest);
    sheets.spreadsheets.batchUpdate(
        {
            spreadsheetId: spreadsheet,
            // range:"Sheet1!7:7",
            // valueInputOption:"USER_ENTERED",
            resource: batchUpdateRequest,
            // resource,
            // fields: 'spreadsheetId'
            // spreadsheetId: spreadsheet,
            // resource: {demoPost}
        }, (err, response) => {
            if(err) {
                console.log(err)
                return(err);
            } else {
                console.log(response.data.values);
                const numRows = response.data.values ? response.data.values.length:0;
                console.log(numRows+" rows retrieved.");
                // console.log(response);
                // return(response);
            }
        }
    )
    console.log("end post")
}

// get data based on user id
app.get('/getQuestions/:userId', function (req, res) {

    currentUser = req.params.userId;
    let r = authorize(credentials, readUserGroups);
    res.send(r);





})

// post data demo
app.get('/postData', function(req, res){
    authorize(credentials, postResponses);
    res.send("end")
    // res.send(postResponses());
    // res.send(res);
})

app.use(reload(path));


app.listen(5000, () => console.log("listening on 5000"));
