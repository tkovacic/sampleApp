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
// sandbox-db
// sqlserver
// #CQ]y>GM5Qf<RYdh

// [START gae_node_request_example]
const express = require('express');
const path = require('path');
const app = express();

var sql = require("mssql");
var bodyParser = require('body-parser');

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
  console.log(request.body);
  var body = JSON.stringify(request.body);
  response.status(200).send('Recieved: ' + body).end();
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
