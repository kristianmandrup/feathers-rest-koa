// TODO: Pure Koa server REST test without feathers
// To ensure we can correctly test a Koa REST endpoint using supertest
import request from 'supertest';

var app = require('./app');
var {
  Routes,
  createRoutes
} = require('../src/app');

var routes = createRoutes(app)
routes.uri = 'person'
var request = require('supertest').agent(app.listen());

describe('Koa', function () {
  describe('CRUD: get', function () {
    it.only('GET .find', done => {
      request
        .get('/person')
        .expect(200, done)
      // .expect('Hello World', done);
    });
  });
});
