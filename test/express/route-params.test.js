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

// default express configuration functions
const config = require('../../src/express');

describe('REST provider', function () {
  describe('route parameters', () => {
    let server, app;

    before(() => {
      app = expressify(feathers())
        .configure(rest())
        .use('/:appId/:id/todo', {
          get(id, params) {
            return Promise.resolve({
              id,
              route: params.route
            });
          }
        });

      server = app.listen(6880);
    });

    after(done => server.close(done));

    it('adds route params as `params.route` and allows id property (#76, #407)', () => {
      const expected = {
        id: 'dishes',
        route: {
          appId: 'theApp',
          id: 'myId'
        }
      };

      return axios.get(`http://localhost:6880/theApp/myId/todo/${expected.id}`)
        .then(res => {
          assert.ok(res.status === 200, 'Got OK status code');
          assert.deepEqual(expected, res.data);
        });
    });
  });
});
