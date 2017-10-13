// TODO: Pure Koa server REST test without feathers
// To ensure we can correctly test a Koa REST endpoint using supertest
import request from 'supertest';

var app = require('./app');
var request = require('supertest').agent(app.listen());

describe('Koa', function () {
  describe('CRUD: get', function () {
    it.only('GET .find', done => {
      request
        .get('/')
        .expect(200)
        .expect('Hello World', done);
    });
  });
});
