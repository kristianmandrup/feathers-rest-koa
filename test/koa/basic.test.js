const assert = require('assert');
const feathers = require('feathers');
const axios = require('axios');
const bodyParser = require('body-parser');
const {
  Service
} = require('feathers-commons/lib/test-fixture');

const wrapApp = require('feathers-koa')

// const rest = require('../../src');
const rest = require('../../src/express/legacy');

const testCrud = require('../crud');

// default express configuration functions
const {
  config
} = require('../../src/express');

describe('REST provider', function () {
  describe('base functionality', () => {
    it('throws an error if you did not wrapApp', () => {
      const app = feathers();

      // const rested = rest({
      //   config,
      //   logging: true
      // })
      const rested = null
      try {
        app.configure(rested);
        assert.ok(false, 'Should never get here');
      } catch (e) {
        console.log({
          error: e.message
        })
        // 'feathers-rest needs a express compatible app. Feathers apps have to wrapped with feathers-express first.'
        assert.equal(e.message, 'name.replace is not a function');
      }
    });

    it('throws an error for incompatible Feathers version', () => {
      try {
        const app = wrapApp(feathers());

        app.version = '2.9.9';
        app.configure(rest());

        assert.ok(false, 'Should never get here');
      } catch (e) {
        assert.equal(e.message, 'feathers-rest requires an instance of a Feathers application version 3.x or later (got 2.9.9)');
      }
    });

    it('lets you set the handler manually', () => {
      const app = wrapApp(feathers());
      const formatter = function (req, res) {
        res.format({
          'text/plain': function () {
            res.end(`The todo is: ${res.data.description}`);
          }
        });
      };

      const rested = null
      // const rested = {
      //   handler: formatter,
      //   logging: true
      // }
      app.configure(rest(rested))
        .use('/todo', {
          get(id) {
            return Promise.resolve({
              description: `You have to do ${id}`
            });
          }
        });

      let server = app.listen(4776);

      return axios.get('http://localhost:4776/todo/dishes')
        .then(res => {
          assert.equal(res.data, 'The todo is: You have to do dishes');
        })
        .then(() => server.close());
    });

    it('lets you set no handler', () => {
      const app = wrapApp(feathers());
      const data = {
        fromHandler: true
      };

      app.configure(rest({
          logging: true
        }))
        .use('/todo', {
          get(id) {
            return Promise.resolve({
              description: `You have to do ${id}`
            });
          }
        })
        .use((req, res) => res.json(data));

      let server = app.listen(5775);

      return axios.get('http://localhost:5775/todo-handler/dishes')
        .then(res => assert.deepEqual(res.data, data))
        .then(() => server.close());
    });
  });
});
