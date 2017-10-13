/* eslint-disable handle-callback-err */

import assert from 'assert';
import request from 'supertest';
import feathers from 'feathers';
import bodyParser from 'koa-bodyparser';
import rest from '../src';
import {
  Service as todoService,
  verify
} from 'feathers-commons/lib/test-fixture';

// Koa testing with supertest
// http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html

export function close(server, done) {
  // console.log('closing', server);
}

export {
  Routes,
  createRoutes
}
from '../src/app'

export {
  assert,
  request,
  feathers,
  bodyParser,
  rest,
  todoService,
  verify
};

let server, app;

export function configure() {
  before(function () {
    app = feathers().configure(rest(rest.formatter))
      .use(bodyParser()) // supports json
      .use('codes', {
        get(id, params, callback) {
          callback();
        },

        create(data, params, callback) {
          callback(null, data);
        }
      })
      .use('todo', todoService);
    server = app.listen(4777, () => app.use('tasks', todoService));
  });

  after(done => close(server, done));

  return app;
}
