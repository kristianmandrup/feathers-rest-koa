const assert = require('assert');
const feathers = require('feathers');
const axios = require('axios');
const bodyParser = require('body-parser');
const {
  Service
} = require('feathers-commons/lib/test-fixture');

const expressify = require('feathers-express')
const rest = require('../../src');
const testCrud = require('../crud');
const {
  formatter
} = require('../../src/express');

// default express configuration functions
const config = require('../../src/express');

describe('REST provider', function () {
  describe('HTTP status codes', () => {
    let app, server;

    before(function () {
      app = expressify(feathers())
        .configure(rest(formatter))
        .use('todo', {
          get(id) {
            return Promise.resolve({
              description: `You have to do ${id}`
            });
          },

          patch() {
            return Promise.reject(new Error('Not implemented'));
          },

          find() {
            return Promise.resolve(null);
          }
        });

      app.use(function (req, res, next) {
        if (typeof res.data !== 'undefined') {
          next(new Error('Should never get here'));
        } else {
          next();
        }
      });

      // Error handler
      app.use(function (error, req, res, next) {
        if (res.statusCode < 400) {
          res.status(500);
        }

        res.json({
          message: error.message
        });
      });

      server = app.listen(4780);
    });

    after(done => server.close(done));

    it('throws a 405 for undefined service methods and sets Allow header (#99)', () => {
      return axios.get('http://localhost:4780/todo/dishes')
        .then(res => {
          assert.ok(res.status === 200, 'Got OK status code for .get');
          assert.deepEqual(res.data, {
            description: 'You have to do dishes'
          }, 'Got expected object');

          return axios.post('http://localhost:4780/todo');
        })
        .catch(error => {
          assert.equal(error.response.headers.allow, 'GET,PATCH');
          assert.ok(error.response.status === 405, 'Got 405 for .create');
          assert.deepEqual(error.response.data, {
            message: 'Method `create` is not supported by this endpoint.'
          }, 'Error serialized as expected');
        });
    });

    it('throws a 404 for undefined route', () => {
      return axios.get('http://localhost:4780/todo/foo/bar')
        .catch(error => {
          assert.ok(error.response.status === 404, 'Got Not Found code');
        });
    });

    it('empty response sets 204 status codes, does not run other middleware (#391)', () => {
      return axios.get('http://localhost:4780/todo')
        .then(res => {
          assert.ok(res.status === 204, 'Got empty status code');
        });
    });
  });
});
