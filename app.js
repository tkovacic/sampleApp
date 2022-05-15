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

const lib = require('./lib-gcp-sql.js');

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
  response.status(200).sendFile(path.join(__dirname, '/web/index.html'));
});

app.get('/signage', (request, response) => {
  response.status(200).sendFile(path.join(__dirname, '/web/signage.html'));
});

app.post('/', (request, response) => {
  var jsonBody = JSON.stringify(request.body);
  var body = JSON.parse(jsonBody);

  var currentCount = 1;
  var parkingType = body.type;
  var parkingDeck = body.parkingStructure;
  var parkingFloor = body.floor;
  var parkingDiff = body.diff;

  var now = new Date();
  var currentDateTime = dateAndTime.format(now,'YYYY-MM-DD Z').substring(0,10);

  lib.getCurrentCount(parkingDiff, parkingDeck, parkingFloor, parkingType, currentDateTime).then(response => {
    var updatedCount = parseInt(parkingDiff) + parseInt(response);
    lib.updateCurrentCount(updatedCount.toString(), parkingDeck, parkingFloor, parkingType, currentDateTime).then(response => {});
  });

  response.status(200).send('Recieved data from deck ' + parkingDeck + ' on floor ' + parkingFloor + ' for ' + parkingType + ' spot with delta of ' + parkingDiff).end();
});

app.get('/currentCount', (request, response) => {
  const parkingDiff = 0;
  const parkingDeck = request.query.deck;
  const parkingFloor = request.query.floor;
  const parkingType = request.query.type;
  const parkingDate = request.query.date;

  lib.getCurrentCount(parkingDiff, parkingDeck, parkingFloor, parkingType, parkingDate).then(counts => {
    response.status(200).send(counts).end();
  });
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
