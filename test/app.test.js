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

const app = require('../app');
const assert = require('assert');
const axios = require('axios');
const baseUrl = "http://localhost:8080";

async function getIndex() {
  var response = axios.get(baseUrl);
  return response;
};

async function postIndex() {
  var response = axios.post(baseUrl, {
    "parkingStructure" : "300",
    "floor" : "1",
    "type" : "standard",
    "diff" : "-1"
  });
  return response;
};

describe('Testing... APP - GET /', () => {
  it('should return 200 OK status', async () => {
    const response = await getIndex();
    assert(response.status == 200);
  });
});

describe('Testing... APP - POST /', () => {
  it('should return 200 OK status', async () => {
    const response = await postIndex();
    assert(response.status == 200);
  });
});
