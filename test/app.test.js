const app = require('../app');
const request = require('supertest');
var expect = require('chai').expect();
var expect = require('chai').should();

describe('gae_node_request_example', () => {
  describe('GET /', () => {
    it('expect to get 200', () => {
      request(app).get('/').expect(200);
    });
    it('should return response of json', () => {
      request(app).get('/', function(err,res,body) {
        res.should.be.a.json;
      });
    });
    it('should return json body of html', () => {
      request(app).get('/', function(err,res,body) {
        body.should.be.a.html;
      });
    });
  });
});
