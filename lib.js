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

module.exports = { getCurrentCount };
