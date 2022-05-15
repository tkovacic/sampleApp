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
}

function updateCurrentCount(count, deck, floor, type) {
	return new Promise(function(resolve, reject) {
		var conn = new sql.ConnectionPool(dbConfig);
	  const transaction = new sql.Transaction(conn);
		conn.connect((error) => {
      if(error) {
        console.log(error);
        reject(error);
      }
			transaction.begin(error => {
				if(error) {
					conn.close();
					reject(error);
				}
		    const request = new sql.Request(transaction);

		    var now = new Date();
		    var currentDateTime = dateAndTime.format(now,'YYYY-MM-DD Z').substring(0,10);

		    request.input('count', sql.VarChar, count.toString());
		    request.input('date', sql.VarChar, currentDateTime);
		    request.input('type', sql.VarChar, type);
		    request.input('floor', sql.VarChar, floor.toString());
		    request.input('deck', sql.VarChar, deck);
				var sqlUpdate = 'UPDATE parking_deck SET parking_deck_count = @count WHERE dt = @date AND parking_deck_count_type = @type AND parking_deck_floor = @floor AND parking_deck = @deck;';

		    request.query(sqlUpdate, (err, result) => {
		    	transaction.commit(error => {
						if(error) {
							conn.close();
							reject(error);
						} else {
							conn.close();
							resolve(result);
						}
		      });
		    });
		  });
		});
	});
}

function getCurrentCount(deck, floor, type) {
	return new Promise(function(resolve, reject) {
		var conn = new sql.ConnectionPool(dbConfig);
	  var dbRequest = new sql.Request(conn);

	  var now = new Date();
	  var currentDateTime = dateAndTime.format(now,'YYYY-MM-DD Z').substring(0,10);

	  dbRequest.input('date', sql.VarChar, currentDateTime);
	  dbRequest.input('type', sql.VarChar, type);
	  dbRequest.input('floor', sql.VarChar, floor.toString());
	  dbRequest.input('deck', sql.VarChar, deck);
	  var sqlQuery = "SELECT * FROM parking_deck WHERE dt = @date AND parking_deck_count_type = @type AND parking_deck_floor = @floor AND parking_deck = @deck;";

	  conn.connect((error) => {
      if(error) {
        console.log(error);
        reject(error);
      }
      dbRequest.query(sqlQuery, (error, recordSet) => {
        if(error) {
          console.log(error);
					conn.close();
					reject(error);
        } else {
          if(recordSet.recordset.length > 0) {
            var jsonBody = JSON.stringify(recordSet.recordset[0]);
            var body = JSON.parse(jsonBody);
						conn.close();
            resolve(body.parking_deck_count);
          } else {
            console.log('need to create new row for new day');
						conn.close();
						resolve('{}');
          }
        }
      });
    });
	});
}

module.exports = { getCurrentCount, updateCurrentCount };
