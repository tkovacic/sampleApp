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
    "floor" : 1,
    "type" : "standard",
    "diff" : -1
  });
  return response;
};

describe('Testing... GET /', () => {
  it('should return 200', async () => {
    const response = await getIndex();
    assert(response.status == 200);
  });
});

describe('Testing... POST /', () => {
  it('should return 200', async () => {
    const response = await getIndex();
    assert(response.status == 200);
  });
});
