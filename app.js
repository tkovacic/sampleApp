// Copyright 2017 Google LLC
//
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

const lib = require('./lib.js');

const express = require('express');
const path = require('path');
const app = express();

var sql = require("mssql");
var bodyParser = require('body-parser');
var dateAndTime = require('date-and-time');

var dbConfig = {
  server: "34.148.177.123",
  database: "sandbox",
  user: "sqlserver",
  password: "#CQ]y>GM5Qf<RYdh",
  port: 1433,
  encrypt: false
};

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  var conn = new sql.ConnectionPool(dbConfig);
  var dbRequest = new sql.Request(conn);

  conn.connect((error) => {
    if(error) {
      console.log(error);
      return;
    }
    dbRequest.query("SELECT * FROM parking_deck", (error, recordSet) => {
      if(error) {
        console.log(error);
      } else {
        console.log(recordSet.recordset);
      }
      conn.close();
      response.status(200).sendFile(path.join(__dirname, '/web/index.html'));
    });
  });
});

app.post('/', (request, response) => {
  var jsonBody = JSON.stringify(request.body);
  var body = JSON.parse(jsonBody);

  var currentCount = 1;
  var parkingType = body.type;
  var parkingDeck = body.parkingStructure;
  var parkingFloor = body.floor;
  var parkingDiff = body.diff;

  lib.getCurrentCount(parkingDeck, parkingFloor, parkingType).then(response => {
    console.log(response);
  });

  /*var conn = new sql.ConnectionPool(dbConfig);
  const transaction = new sql.Transaction(conn);
  transaction.begin(error => {
    const request = new sql.Request(transaction);

    var now = new Date();
    var currentDateTime = date.format(now,'YYYY-MM-DD 00:00:00.000');

    sql.input('IN1', sql.Integer, currentCount);
    sql.input('IN2', sql.DateTime, currentDateTime);
    sql.input('IN3', sql.Varchar, parkingType);
    sql.input('IN4', sql.Integer, parkingFloor);
    sql.input('IN5', sql.Varchar, parkingDeck);

    request.query('UPDATE parking_deck SET parking_deck_count = @IN1 WHERE dt = @IN2 AND parking_deck_count_type = @IN3 AND parking_deck_floor = @IN4 AND parking_deck = @IN5', (err, result) => {
        transaction.commit(error => {
            console.log("Transaction committed.");
      });
    });
  });*/
  response.status(200).send('Recieved data from deck ' + parkingDeck + ' on floor ' + parkingFloor + ' for ' + parkingType + ' spot with delta of ' + parkingDiff).end();
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
