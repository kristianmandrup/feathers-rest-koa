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
from '../src/koa/routes'

export {
  assert,
  request,
  feathers,
  bodyParser,
  rest,
  todoService,
  verify
};
const log = console.log

let serve, app, port;

const koaify = require('../src/koa/ify')

function wrap(app) {
  console.log('koaify app.use', {
    use: app.use
  })
  let wrapped = koaify(app)
  console.log('koaified app.use', {
    use: app.use
  })
  return wrapped
}

export function configure(opts = {}) {
  console.log('configure', opts)
  port = opts.port || 4777

  app = feathers()
  app = wrap(app)

  // Note: rest factory will configure json body parser
  app
    .configure(rest(opts))



  // .use(bodyParser()) // supports json (now done via configure(rest()))
  app
    // FIX: calling .use does not add the routes via koa-router!!
    .use('codes', {
      get(id, params, callback) {
        callback();
      },

      create(data, params, callback) {
        callback(null, data);
      }
    })
    .use('todo', todoService);

  function serve() {
    log('serving app')
    app.listen(port, () => {
      log('listening on port', port)
      app.use('tasks', todoService)
    });
  }

  let req = request.agent(serve())

  return {
    req,
    app,
    serve
  };
}
