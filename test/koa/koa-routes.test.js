// TODO: Pure Koa server REST test without feathers
// To ensure we can correctly test a Koa REST endpoint using supertest
var app = require('./app');
var {
  Routes,
  createRoutes
} = require('../../src/app');

var routes = createRoutes(app)
routes.uri = 'person'
var request = require('supertest').agent(app.listen());

describe('Koa', function () {
  describe('CRUD: get', function () {
    it('GET .find person', done => {
      request
        .get('/person')
        .expect(200, done)
      // .expect('Hello World', done);
    });

    it('GET .find person/1', done => {
      request
        .get('/person/1')
        .expect(200, done)
      // .expect('Hello World', done);
    });
  });
});
