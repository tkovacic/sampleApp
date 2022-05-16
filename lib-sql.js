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

const fs = require('fs');
const sql = require("mssql");

var config = require('./config/config');

var dbTCPConfig = {
  server: config.server,
  database: config.database,
  user: config.user,
  password: config.password,
  port: parseInt(config.port),
  encrypt: config.encrypt,
}
/*var dbSSLConfig = {
  server: "sandbox-sqldb-server.database.windows.net",
  database: "sandbox-db",
  user: "sqlserver",
  password: "GCQ]y>GM5Qf<RYdh",
  port: 3306,
  encrypt: true
	ssl: {ca: fs.readFileSync(__dirname + '/web/cert/server-ca.pem')}
}*/

var maxAvailability = 100;

function addNewRow(diff, deck, floor, type, currentDateTime) {
	return new Promise(function(resolve, reject) {
		var conn = new sql.ConnectionPool(dbTCPConfig);
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

				var tmpAvail = parseInt(maxAvailability) + parseInt(diff);
		    request.input('count', sql.VarChar, tmpAvail.toString());
		    request.input('date', sql.VarChar, currentDateTime);
		    request.input('type', sql.VarChar, type);
		    request.input('floor', sql.VarChar, floor.toString());
		    request.input('deck', sql.VarChar, deck);
				var sqlInsert = 'INSERT INTO parking_signage VALUES (@deck,@floor,@type,@count,@date);';

		    request.query(sqlInsert, (err, result) => {
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

function updateCurrentCount(count, deck, floor, type, currentDateTime) {
	return new Promise(function(resolve, reject) {
		var conn = new sql.ConnectionPool(dbTCPConfig);
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

		    request.input('count', sql.VarChar, count.toString());
		    request.input('date', sql.VarChar, currentDateTime);
		    request.input('type', sql.VarChar, type);
		    request.input('floor', sql.VarChar, floor.toString());
		    request.input('deck', sql.VarChar, deck);
				var sqlUpdate = 'UPDATE parking_signage SET parking_deck_count = @count WHERE parking_day = @date AND parking_deck_count_type = @type AND parking_deck_floor = @floor AND parking_deck = @deck;';

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

function getCurrentCount(diff, deck, floor, type, currentDateTime) {
	return new Promise(function(resolve, reject) {
		var conn = new sql.ConnectionPool(dbTCPConfig);
	  var dbRequest = new sql.Request(conn);

	  dbRequest.input('date', sql.VarChar, currentDateTime);
	  dbRequest.input('type', sql.VarChar, type);
	  dbRequest.input('floor', sql.VarChar, floor.toString());
	  dbRequest.input('deck', sql.VarChar, deck);
	  var sqlQuery = "SELECT * FROM parking_signage WHERE parking_day = @date AND parking_deck_count_type = @type AND parking_deck_floor = @floor AND parking_deck = @deck;";

	  conn.connect(function(error) {
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
            addNewRow(diff, deck, floor, type, currentDateTime).then(response => {
							conn.close();
							var tmpAvail = parseInt(maxAvailability) + parseInt(diff);
							resolve(tmpAvail);
						});
          }
        }
      });
    });
	});
}

module.exports = { getCurrentCount, updateCurrentCount, addNewRow };
