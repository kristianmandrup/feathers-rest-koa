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
  describe('middleware', () => {
    it('sets service parameters and provider type', () => {
      let service = {
        get(id, params) {
          return Promise.resolve(params);
        }
      };

      let server = expressify(feathers())
        .configure(rest(formatter))
        .use(function (req, res, next) {
          assert.ok(req.feathers, 'Feathers object initialized');
          req.feathers.test = 'Happy';
          next();
        })
        .use('service', service)
        .listen(4778);

      return axios.get('http://localhost:4778/service/bla?some=param&another=thing')
        .then(res => {
          let expected = {
            test: 'Happy',
            provider: 'rest',
            route: {},
            query: {
              some: 'param',
              another: 'thing'
            }
          };

          assert.ok(res.status === 200, 'Got OK status code');
          assert.deepEqual(res.data, expected, 'Got params object back');
        })
        .then(() => server.close());
    });

    it('Lets you configure your own middleware before the handler (#40)', () => {
      const data = {
        description: 'Do dishes!',
        id: 'dishes'
      };
      const app = expressify(feathers());

      app.use(function defaultContentTypeMiddleware(req, res, next) {
          req.headers['content-type'] = req.headers['content-type'] || 'application/json';
          next();
        })
        .configure(rest(rest.formatter))
        .use(bodyParser.json())
        .use('/todo', {
          create(data) {
            return Promise.resolve(data);
          }
        });

      const server = app.listen(4775);
      const options = {
        url: 'http://localhost:4775/todo',
        method: 'post',
        data,
        headers: {
          'content-type': ''
        }
      };

      return axios(options)
        .then(res => {
          assert.deepEqual(res.data, data);
          server.close();
        });
    });

    it('allows middleware before and after a service', () => {
      const app = expressify(feathers());

      app.configure(rest())
        .use(bodyParser.json())
        .use('/todo', function (req, res, next) {
          req.body.before = ['before first'];
          next();
        }, function (req, res, next) {
          req.body.before.push('before second');
          next();
        }, {
          create(data) {
            return Promise.resolve(data);
          }
        }, function (req, res, next) {
          res.data.after = ['after first'];
          next();
        }, function (req, res, next) {
          res.data.after.push('after second');
          next();
        });

      const server = app.listen(4776);

      return axios.post('http://localhost:4776/todo', {
          text: 'Do dishes'
        })
        .then(res => {
          assert.deepEqual(res.data, {
            text: 'Do dishes',
            before: ['before first', 'before second'],
            after: ['after first', 'after second']
          });
        })
        .then(() => server.close());
    });

    it('formatter does nothing when there is no res.data', () => {
      const data = {
        message: 'It worked'
      };
      const app = expressify(feathers()).use('/test',
        rest.formatter,
        (req, res) => res.json(data)
      );

      const server = app.listen(7988);

      return axios.get('http://localhost:7988/test')
        .then(res => assert.deepEqual(res.data, data))
        .then(() => server.close());
    });
  });
});
