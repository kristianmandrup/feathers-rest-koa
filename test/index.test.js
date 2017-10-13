/* eslint-disable handle-callback-err */

import assert from 'assert';
import request from 'supertest';
import feathers from 'feathers';
import bodyParser from 'koa-bodyparser';
import rest from '../src';
import { Service as todoService, verify } from 'feathers-commons/lib/test-fixture';

// Koa testing with supertest
// http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html

function close (server, done) {
  // console.log('closing', server);
}

describe('REST provider', function () {
  describe('CRUD', function () {
    let server, app;

    before(function () {
      app = feathers().configure(rest(rest.formatter))
        .use(bodyParser()) // supports json
        .use('codes', {
          get (id, params, callback) {
            callback();
          },

          create (data, params, callback) {
            callback(null, data);
          }
        })
        .use('todo', todoService);
      server = app.listen(4777, () => app.use('tasks', todoService));
    });

    after(done => close(server, done));

    describe('Services', () => {
      it('sets the hook object in res.hook', done => {
        app.use('/hook', {
          get (id, params, callback) {
            callback(null, { description: `You have to do ${id}` });
          }
        }, function (ctx, next) {
          ctx.body.hook = ctx.hook;
          next();
        });

        request('http://localhost:4777/hook/dishes', (error, response, body) => {
          const hook = JSON.parse(body).hook;
          assert.deepEqual(hook, {
            id: 'dishes',
            params: {
              query: {},
              provider: 'rest'
            },
            method: 'get',
            type: 'after'
          });
          done();
        });
      });

      it('sets the hook object in res.hook on error', done => {
        app.use('/hook-error', {
          get () {
            return Promise.reject(new Error('I blew up'));
          }
        }, function (ctx, next) {
          ctx.status(500);
          ctx.json({
            hook: ctx.hook
          });
        });

        request
          .get('http://localhost:4777/hook-error/dishes')
          .end((error, response) => {
            const hook = JSON.parse(response.body).hook;
            assert.deepEqual(hook, {
              id: 'dishes',
              params: {
                query: {},
                provider: 'rest'
              },
              method: 'get',
              type: 'error'
            });
            done();
          });
      });

      it('GET .find', done => {
        request
          .get('http://localhost:4777/todo')
          .expect(200)
          .end((error, response, body) => {
            verify.find(JSON.parse(body));
            done(error);
          });
      });

      it('GET .get', done => {
        request
          .get('http://localhost:4777/todo/dishes')
          .expect(200)
          .end((error, response, body) => {
            verify.get('dishes', JSON.parse(body));
            done(error);
          });
      });

      it('POST .create', done => {
        let original = {
          description: 'POST .create'
        };

        request
          .post('http://localhost:4777/todo')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(201)
          .end((error, response, body) => {
            verify.create(original, JSON.parse(body));
            done(error);
          });
      });

      it('PUT .update', done => {
        let original = {
          description: 'PUT .update'
        };

        request
          .put('http://localhost:4777/todo/544')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response) => {
            verify.update(544, original, JSON.parse(response.body));
            done(error);
          });
      });

      it('PUT .update many', done => {
        let original = {
          description: 'PUT .update',
          many: true
        };

        request
          .put('http://localhost:4777/todo')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response, body) => {
            let data = JSON.parse(body);
            verify.update(null, original, data);

            done(error);
          });
      });

      it('PATCH .patch', done => {
        let original = {
          description: 'PATCH .patch'
        };

        request
          .patch('http://localhost:4777/todo/544')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response, body) => {
            verify.patch(544, original, JSON.parse(body));
            done(error);
          });
      });

      it('PATCH .patch many', done => {
        let original = {
          description: 'PATCH .patch',
          many: true
        };

        request
          .patch('http://localhost:4777/todo')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response) => {
            verify.patch(null, original, JSON.parse(response.body));
            done(error);
          });
      });

      it('DELETE .remove', done => {
        request
          .delete('http://localhost:4777/tasks/233')
          .expect(200)
          .end((error, response) => {
            verify.remove(233, JSON.parse(response.body));
            done(error);
          });
      });

      it('DELETE .remove many', done => {
        request
          .delete('http://localhost:4777/tasks')
          .expect(200)
          .end((error, response) => {
            verify.remove(null, JSON.parse(response.body));
            done(error);
          });
      });
    });

    describe('Dynamic Services', () => {
      it('GET .find', done => {
        request
          .get('http://localhost:4777/tasks')
          .expect(200)
          .end((error, response, body) => {
            verify.find(JSON.parse(body));
            done(error);
          });
      });

      it('GET .get', done => {
        request
          .get('http://localhost:4777/tasks/dishes')
          .expect(200)
          .end((error, response) => {
            verify.get('dishes', JSON.parse(response.body));
            done(error);
          });
      });

      it('POST .create', done => {
        let original = {
          description: 'Dynamic POST .create'
        };

        request
          .post('http://localhost:4777/tasks')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(201)
          .end((error, response) => {
            verify.create(original, JSON.parse(response.body));
            done(error);
          });
      });

      it('PUT .update', done => {
        let original = {
          description: 'Dynamic PUT .update'
        };

        request
          .put('http://localhost:4777/tasks/544')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response) => {
            verify.update(544, original, JSON.parse(response.body));
            done(error);
          });
      });

      it('PATCH .patch', done => {
        let original = {
          description: 'Dynamic PATCH .patch'
        };

        request
          .patch('http://localhost:4777/tasks/544')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response) => {
            verify.patch(544, original, JSON.parse(response.body));
            done(error);
          });
      });

      it('DELETE .remove', done => {
        request
          .delete('http://localhost:4777/tasks/233')
          .end((error, response, body) => {
            assert.ok(response.statusCode === 200, 'Got OK status code');
            verify.remove(233, JSON.parse(body));
            done(error);
          });
      });
    });
  });

  describe('HTTP status codes', () => {
    let app;
    let server;

    before(function () {
      app = feathers().configure(rest())
        .use('todo', {
          get (id) {
            return Promise.resolve({ description: `You have to do ${id}` });
          },

          patch () {
            return Promise.reject(new Error('Not implemented'));
          },

          find () {
            return Promise.resolve(null);
          }
        });

      app.use(function (ctx, next) {
        if (typeof ctx.body !== 'undefined') {
          next(new Error('Should never get here'));
        } else {
          next();
        }
      });

      // Error handler
      app.on('error', function (error, ctx) {
        console.log({
          error,
          ctx
        });
      });

      server = app.listen(4780);
    });

    after(done => close(server, done));

    it('throws a 405 for undefined service methods and sets Allow header (#99)', done => {
      request
        .get('http://localhost:4780/todo/dishes')
        .expect(200)
        .end((error, response) => {
          assert.deepEqual(JSON.parse(response.body), { description: 'You have to do dishes' }, 'Got expected object');

          request
            .post('http://localhost:4780/todo')
            .expect(405)
            .end((error, response) => {
              assert.equal(response.headers.allow, 'GET,PATCH');
              assert.deepEqual(JSON.parse(response.body), { message: 'Method `create` is not supported by this endpoint.' }, 'Error serialized as expected');
              done();
            });
        });
    });

    it('throws a 404 for undefined route', done => {
      request
        .get('http://localhost:4780/todo/foo/bar')
        .expect(404)
        .end((error, response) => {
          done(error);
        });
    });

    it('empty response sets 204 status codes, does not run other middleware (#391)', done => {
      request
        .get('http://localhost:4780/todo')
        .expect(204)
        .end((error, response) => {
          done(error);
        });
    });
  });
});
