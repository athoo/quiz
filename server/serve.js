var express = require('express')
var app = express()


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

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';
let users = {};
let data = {};


// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), readUserGroups);
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

    sheets.spreadsheets.values.get({
        spreadsheetId: '1t-vq8EQvkuS_Pm2muavFm_plxLsDJqiiZ1uVIsKNdYg',
        range: 'Sheet1!A2:E',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            // console.log('Name, Major:');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                users[`${row[0]}`] = [`${row[1]}`, `${row[2]}`, `${row[3]}`, `${row[4]}`];
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}`);
            });
            // getQuestions(2);
            // console.log(users);
        } else {
            console.log('No data found.');
        }
    });

    sheets.spreadsheets.values.get({
        spreadsheetId: '1t-vq8EQvkuS_Pm2muavFm_plxLsDJqiiZ1uVIsKNdYg',
        range: 'xxx!A2:B',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            // console.log('Name, Major:');
            // Print columns A and E, which correspond to indices 0 and 4.

            data['xxx']=[];
            rows.map((row) => {
                console.log(`${row[0]}, ${row[1]}`);

                data['xxx'][`${row[0]}`-1] = `${row[1]}`;
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}`);
            });
            // getQuestions(2);
            // console.log(users);
        } else {
            console.log('No data found.');
        }
    });

    sheets.spreadsheets.values.get({
        spreadsheetId: '1t-vq8EQvkuS_Pm2muavFm_plxLsDJqiiZ1uVIsKNdYg',
        range: 'yyy!A2:B',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            // console.log('Name, Major:');
            // Print columns A and E, which correspond to indices 0 and 4.
            data['yyy']=[];
            rows.map((row) => {
                data['yyy'][`${row[0]}`-1] = `${row[1]}`;
                // console.log(`${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}`);
            });
            // getQuestions(2);
            // console.log(users);
        } else {
            console.log('No data found.');
        }
    });
}

// get questions for a specific user
function getQuestions(user){
    let conditions = users[user];
    console.log(conditions[0]);
    let i_1 = conditions[0];
    let d_1 = conditions[1];
    let i_2 = conditions[2];
    let d_2 = conditions[3];
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


app.get('/getQuestions/:userId', function (req, res) {
    res.send(getQuestions(req.params.userId));
})



app.listen(5000);
