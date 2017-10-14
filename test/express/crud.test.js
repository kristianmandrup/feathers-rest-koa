const assert = require('assert');
const feathers = require('feathers');
const axios = require('axios');
const bodyParser = require('body-parser');
const {
  Service
} = require('feathers-commons/lib/test-fixture');

const expressify = require('feathers-express')
const rest = require('../../src');
const {
  formatter
} = require('../../src/express');
const testCrud = require('../crud');

// default express configuration functions
const {
  config
} = require('../../src/express');

describe('REST provider', function () {
  describe('CRUD', () => {
    let server, app;

    before(function () {
      app = expressify(feathers())
        .configure(rest(formatter))
        .use(bodyParser.json())
        .use('codes', {
          get(id, params) {
            return Promise.resolve({
              id
            });
          },

          create(data) {
            return Promise.resolve(data);
          }
        })
        .use('todo', Service);

      server = app.listen(4777, () => app.use('tasks', Service));
    });

    after(done => server.close(done));

    testCrud('Services', 'todo');
    testCrud('Dynamic Services', 'tasks');

    describe('res.hook', () => {
      const convertHook = hook => {
        const result = Object.assign({}, hook);

        delete result.service;
        delete result.app;

        return result;
      };

      it('sets the actual hook object in res.hook', () => {
        app.use('/hook', {
          get(id) {
            return Promise.resolve({
              description: `You have to do ${id}`
            });
          }
        }, function (req, res, next) {
          res.data = convertHook(res.hook);

          next();
        });

        app.service('hook').hooks({
          after(hook) {
            hook.addedProperty = true;
          }
        });

        return axios.get('http://localhost:4777/hook/dishes?test=param')
          .then(res => {
            assert.deepEqual(res.data, {
              id: 'dishes',
              params: {
                route: {},
                query: {
                  test: 'param'
                },
                provider: 'rest'
              },
              type: 'after',
              method: 'get',
              path: 'hook',
              result: {
                description: 'You have to do dishes'
              },
              addedProperty: true
            });
          });
      });

      it('can use hook.dispatch', () => {
        app.use('/hook-dispatch', {
          get(id) {
            return Promise.resolve({});
          }
        });

        app.service('hook-dispatch').hooks({
          after(hook) {
            hook.dispatch = {
              id: hook.id,
              fromDispatch: true
            };
          }
        });

        return axios.get('http://localhost:4777/hook-dispatch/dishes')
          .then(res => {
            assert.deepEqual(res.data, {
              id: 'dishes',
              fromDispatch: true
            });
          });
      });

      it('sets the hook object in res.hook on error', () => {
        app.use('/hook-error', {
          get() {
            return Promise.reject(new Error('I blew up'));
          }
        }, function (error, req, res, next) {
          res.status(500);
          res.json({
            hook: convertHook(res.hook),
            error: {
              message: error.message
            }
          });
        });

        return axios('http://localhost:4777/hook-error/dishes')
          .catch(error => {
            assert.deepEqual(error.response.data, {
              hook: {
                id: 'dishes',
                params: {
                  route: {},
                  query: {},
                  provider: 'rest'
                },
                type: 'error',
                method: 'get',
                path: 'hook-error',
                result: null,
                error: {}
              },
              error: {
                message: 'I blew up'
              }
            });
          });
      });
    });
  });
});
