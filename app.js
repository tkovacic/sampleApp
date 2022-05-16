// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const mssqlLib = require('./lib/mssql.js');

const express = require('express');
const path = require('path');
const app = express();

var bodyParser = require('body-parser');
var dateAndTime = require('date-and-time');

app.enable('trust proxy');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.status(200).sendFile(path.join(__dirname, '/web/html/index.html'));
});

app.get('/signage', (request, response) => {
  response.status(200).sendFile(path.join(__dirname, '/web/html/signage.html'));
});

app.post('/', (request, response) => {
  var jsonBody = JSON.stringify(request.body);
  var body = JSON.parse(jsonBody);

  var currentCount = 1;
  var parkingType = body.type;
  var parkingDeck = body.parkingStructure;
  var parkingFloor = body.floor;
  var parkingDiff = body.diff;

  if(parkingDeck=="300") {} else {response.status(400).send('Rejected parking deck: ' + parkingDeck + '...only 300').end(); return;};
  if(parkingType=="standard" || parkingType=="ada" || parkingType=="ev") {} else {response.status(400).send('Rejected parking type: ' + parkingType + '...only standard, ada, ev').end(); return;};
  if(parseInt(parkingFloor) < 1 || parseInt(parkingFloor) > 2) {response.status(400).send('Rejected parking floor: ' + parkingFloor + '...only floor 1, 2').end(); return;};
  if(parseInt(parkingDiff) < -1 || parseInt(parkingDiff) > 1 || parseInt(parkingDiff) == 0) {response.status(400).send('Rejected parking diff: ' + parkingDiff + '...only 1, -1').end(); return;};

  var now = new Date();
  var currentDateTime = dateAndTime.format(now,'YYYY-MM-DD Z').substring(0,10);

  mssqlLib.getCurrentCount(parkingDiff, parkingDeck, parkingFloor, parkingType, currentDateTime).then(response => {
    var updatedCount = parseInt(parkingDiff) + parseInt(response);
    mssqlLib.updateCurrentCount(updatedCount.toString(), parkingDeck, parkingFloor, parkingType, currentDateTime).then(response => {});
  });

  response.status(200).send('Recieved data from deck ' + parkingDeck + ' on floor ' + parkingFloor + ' for ' + parkingType + ' spot with delta of ' + parkingDiff).end();
});

app.get('/currentCount', (request, response) => {
  const parkingDiff = 0;
  const parkingDeck = request.query.deck;
  const parkingFloor = request.query.floor;
  const parkingType = request.query.type;
  const parkingDate = request.query.date;

  mssqlLib.getCurrentCount(parkingDiff, parkingDeck, parkingFloor, parkingType, parkingDate).then(counts => {
    response.status(200).send(counts).end();
  });
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
