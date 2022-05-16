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

const lib = require('../lib/mssql.js');
const assert = require('assert');

var sql = require("mssql");
var bodyParser = require('body-parser');
var dateAndTime = require('date-and-time');

describe('Testing... LIB - SQL Connection Read', () => {
  it('should return 1 dummy row with current count of 0', async () => {
		var result;
    await lib.getCurrentCount('0','300','1','standard','0000-00-00').then(response => {
			result = response;
		});
		assert(result==0);
  });
});

describe('Testing... LIB - SQL Connection Write', () => {
  it('should return 1 dummy row affected', async () => {
		var result;
    await lib.updateCurrentCount('0','300','1','standard','0000-00-00').then(response => {
			result = response.rowsAffected;
		});
		assert(result==1);
  });
});
