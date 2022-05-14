const app = require('../app');
const assert = require('assert');
const axios = require('axios');
const baseUrl = "http://localhost:8080";

async function getIndex() {
  var response = axios.get(baseUrl);
  return response;
};

describe('Testing... GET /', () => {
  it('should return 200', async () => {
    const response = await getIndex();
    assert(response.status == 200);
  });
});
