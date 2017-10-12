/* eslint-disable handle-callback-err */

import assert from 'assert';
import request from 'supertest';
import feathers from 'feathers';
import bodyParser from 'koa-bodyparser';
import rest from '../src';

// Koa testing with supertest
// http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html

function close (server, done) {
  console.log('closing', server);
}

describe('REST provider', function () {
  it('sets service parameters and provider type', done => {
    let service = {
      get (id, params, callback) {
        callback(null, params);
      }
    };

    let server = feathers().configure(rest(rest.formatter))
      .use(function (ctx, next) {
        assert.ok(ctx.feathers, 'Feathers object initialized');
        ctx.feathers.test = 'Happy';
        next();
      })
      .use('service', service)
      .listen(4778);

    request
      .get('http://localhost:4778/service/bla?some=param&another=thing')
      .expect(200)
      .end((error, response) => {
        let expected = {
          test: 'Happy',
          provider: 'rest',
          query: {
            some: 'param',
            another: 'thing'
          }
        };
        assert.deepEqual(JSON.parse(response.body), expected, 'Got params object back');
        close(server, done);
      });
  });

  it('lets you set the handler manually', done => {
    let app = feathers();

    app.configure(rest(async function (ctx, next) {
      ctx.format({
        'text/plain': function () {
          ctx.body = `The todo is: ${ctx.body.description}`;
        }
      });
    }))
      .use('/todo', {
        get (id, params, callback) {
          callback(null, { description: `You have to do ${id}` });
        }
      });

    let server = app.listen(4776);
    request
      .get('http://localhost:4776/todo/dishes')
      .end((error, response) => {
        assert.equal(response.body, 'The todo is: You have to do dishes');
        close(server, done);
      });
  });

  it('Lets you configure your own middleware before the handler (#40)', done => {
    let data = { description: 'Do dishes!', id: 'dishes' };
    let app = feathers();

    app.use(function defaultContentTypeMiddleware (ctx, next) {
      let type = ctx.get('content-type') || 'application/json';
      ctx.set('content-type', type);
      next();
    })
    .configure(rest(rest.formatter))
    .use(bodyParser()) // supports json
    .use('/todo', {
      create (data, params, callback) {
        callback(null, data);
      }
    });

    let server = app.listen(4775);
    request
      .post('http://localhost:4775/todo')
      .send(JSON.stringify(data))
      .end((error, response) => {
        assert.deepEqual(JSON.parse(response.body), data);
        close(server, done);
      });
  });

  it('Extend params with route params and allows id property (#76, #407)', done => {
    const todoService = {
      get (id, params) {
        return Promise.resolve({
          id,
          appId: params.appId,
          paramsId: params.id
        });
      }
    };

    const app = feathers()
      .configure(rest())
      .use('/:appId/:id/todo', todoService);

    const expected = {
      id: 'dishes',
      appId: 'theApp',
      paramsId: 'myId'
    };

    const server = app.listen(6880).on('listening', function () {
      request
        .get('http://localhost:6880/theApp/myId/todo/' + expected.id)
        .expect(200)
        .end((error, response) => {
          assert.deepEqual(expected, JSON.parse(response.body));
          close(server, done);
        });
    });
  });
});
