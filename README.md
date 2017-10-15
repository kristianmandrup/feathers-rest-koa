# feathers-rest-koa

[![Greenkeeper badge](https://badges.greenkeeper.io/feathersjs/feathers-rest-koa.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/feathersjs/feathers-rest-koa.png?branch=master)](https://travis-ci.org/feathersjs/feathers-rest-koa)
[![Code Climate](https://codeclimate.com/github/feathersjs/feathers-rest-koa/badges/gpa.svg)](https://codeclimate.com/github/feathersjs/feathers-rest-koa)
[![Test Coverage](https://codeclimate.com/github/feathersjs/feathers-rest-koa/badges/coverage.svg)](https://codeclimate.com/github/feathersjs/feathers-rest-koa/coverage)
[![Dependency Status](https://img.shields.io/david/feathersjs/feathers-rest-koa.svg?style=flat-square)](https://david-dm.org/feathersjs/feathers-rest-koa)
[![Download Status](https://img.shields.io/npm/dm/feathers-rest-koa.svg?style=flat-square)](https://www.npmjs.com/package/feathers-rest-koa)
[![Slack Status](http://slack.feathersjs.com/badge.svg)](http://slack.feathersjs.com)

> The Feathers REST API provider

## Status

*Under development!*

Bassed on the `major` branch (v3) of [feathers-rest](https://github.com/feathersjs/feathers-rest).

To be used with [feathers](https://github.com/feathersjs/feathers) major or ore branch.

Use the [feathers-koa](https://github.com/hmudesign/feathers-koa) package, similar to [feathers-express](https://github.com/feathersjs/feathers-express) to "koaify" or "expressify" a feathers app.

### Current issues



Currently the `test/services/` tests use `feathers-koa` to koaify the app so that the core feathers methods such as `use` work as koa `use`. This is quite "hacky".

```js
export class Config extends BaseConfig {
  // ...
  configJson() {
    // ...
    app.use(jsonHandler) // <-- works as koa .use
  }
  // ...
}
```

We could perhaps enable feathers to wrap multiple servers, and expose each server such as `app.koa`, `app.express` etc. Perhaps even multiple servers on different port with different unique names, ie. `app.koa_admin` and `app.koa_guest` etc. or even: `app.koa.guest`

Your thoughts?

## About

This provider exposes [Feathers](http://feathersjs.com) services through a RESTful API using [Koa](http://koajs.com) that can be used with Feathers 1.x and 2.x as well as client support for Fetch, jQuery, Request, Superagent, axios and angular2+'s HTTP Service.

__Note:__ For the full API documentation go to [https://docs.feathersjs.com/api/rest.html](https://docs.feathersjs.com/api/rest.html).

## REST Client

The REST client has been extracted. In the future it will likely be in a separate repo `feathers-rest-client`.

Please help make this happen ;)

## Quick example

You can optionally pass options to `rest` function to customize the internal behavior as needed (see *rest method* section below for details and example)

Basic config, using default Koa `rest` setup.

```js
import Koa from 'koa';
import feathers from 'feathers';
import bodyParser from 'koa-bodyparser'
import rest from 'feathers-rest-koa';

const koa = new Koa()
const app = feathers(koa)
  .configure(rest()) // <-- configure Feathers app with Koa REST
  .use(bodyParser())
  .use(function(req, res, next) {
    req.feathers.data = 'Hello world';
    next();
  });

app.use('/:app/todos', {
  get: function(id, params) {
    console.log(params.data); // -> 'Hello world'
    console.log(params.app); // will be `my` for GET /my/todos/dishes

    return Promise.resolve({
      id,
      params,
      description: `You have to do ${name}!`
    });
  }
});
```

## Customization

Configuring REST for a specific/alternative web server such as Express, with debug and logging enabled.

```js
// import express defaults (or import/define your own)
import { defaults } from 'feathers-rest-koa/lib/express'
import rest from 'feathers-rest-koa' // not hardcoded to koa ;)

app.configure(rest({
  defaults,
  debug: 'feathers-koa', // set debug mode (see https://www.npmjs.com/package/debug)
  logging: true // enable logging
}));
```

Debug modes (currently) available:

- `feathers:rest`
- `feathers:koa`

## Testing

Run all tests

`$ npm test` or `$ mocha`

Run single test

`$ mocha test/services/get.test.js`

Run matching tests using Grep pattern

`$ mocha --grep GET`

To run a single test spec, use the `.only` (see [run-single-mocha-test](https://jaketrent.com/post/run-single-mocha-test/))

```js
// ...
  describe('Services', () => {
    it.only('GET .find', done => {
      // ...
    })
  })
```

Enjoy!

## Changes for more generic REST configuration

The `wrappers.js` file now uses a `createSetter` to create an object with operators to set the header and status code of the context or response object passed in each middleware function (depending on framework used).

```js
function getHandler(method, getArgs, service, opts = {}) {
  return async function (ctx, next) {
    let createSetter = opts.createSetter || koaCreateSetter
    let setter = createSetter(ctx)
    // ...
    setter.setHeader('Allow', allowedMethods(service).join(','));
```

### rest method

The main `rest` method has been made more generic and customisable.

```js
import wrappers from './wrappers';
import {
  config as defaultConfig
} from './koa'

export default function rest(opts = {}) {
  return function () {
    const defaults = opts.defaults || _defaults || {}
    const app = this;
    app.rest = wrappers;

    let config = opts.config || defaultConfig
    config(app, opts)
  };
}
```

### Customizing the REST configuration

You can pass in custom configuration functions via the `opts` parameter.
Each of the optional functions have the signature `(app, opts)`

```js
function config(app, opts) {
  // configures app as needed
}

let app = feathers()
  .configure(rest({
    config
  }))
```

## Development

### Express

Start from the `test/express` folder and make sure that the routes added by the `Routes` class work as required by feathers.

Start with the `test/express/basic.test.js` and make each test file pass from there...
When done, move on to `test/koa` ;)

`$ mocha test/express/basic.test.js`

### Koa

The main Koa test suite

`$ mocha test/koa/major.test.js`

Better to split it up in smaller parts, as has been done for `express`

We (likely?) need to create a `koaify` method, similar to `expressify` from [feathers-express](https://github.com/feathersjs/feathers-express).

See the [feathers-koa](https://github.com/hmudesign/feathers-koa) which may be a much better starting point!

```js
  // FIX: need to wrap feathers app with koaify!!
  app = feathers()
    // Note: rest factory will configure json body parser
    .configure(rest(opts))
    // .use(bodyParser()) // supports json (now done via configure(rest()))

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
```

Been trying to integrate the work done in [feathers#major](https://github.com/feathersjs/feathers-rest/tree/major) (v3) branch.

Please follow along in this [issue #133](https://github.com/feathersjs/feathers-rest/issues/133#issuecomment-336619412)

Main issue is how to add multiple middleware functions to Koa for a given route using the [koa-router](https://github.com/alexmingoia/koa-router)

```js
  configRouteMws(route, httpMethod, routeMws) {
    this.notImplemented('configRouteMws')
  }
```

## Architecture

- `Config` configures a feathers app with REST capability for a given web server
- `Routes` manage/add feathers REST routes
- `Rest` iterate REST methods and create a separate route for each
- `Route` create/add single REST route for a service

### Base classes

Found in `src/base`:

- `Config`
- `Routes`
- `Route`
- `Logger` logging/debugging and error handling

### Config

- `configJson` configure feathers with JSON body parsing
- `configProvider` set feathers REST provider (meta data)
- `configRest` add REST routes

### Routes

The `Routes` class can be extended for your own framework wrapper. It should include methods to add `base` and `id` routes to the feathers app and/or a router of your choice.

TODO: more API docs

You can customize the router and route creating by passing any of these functions in options:

- `createRouter()`
- `createRest(path)`

`createRest` will be called in the context of the `Routes` instance (this)

### Rest

Generic `Rest` class to iterate all feathers REST service methods and create single route for each.

You can customize the `Route` generator by supplying a custom `createRoute()` method in options. `createRoute` will be called in the context of the `Rest` instance (this)

TODO: more API docs

### Route

The `Route` class can be extended for your own framework wrapper. It should include methods to create and add a single route to the feathers app and/or a router of your choice.

Adding multiple middleware for a route is done in `addRouteMws` which any Route class must implement:

```js
router.get(
  '/users/:id',
  function *(next) {
    this.user = yield User.findOne(this.params.id);
    yield next;
  },
  function *(next) {
    console.log(this.user);
    // => { id: 17, name: "Alex" }
  }
);
```

For the KoaRoute it is done [like this](https://github.com/alexmingoia/koa-router#multiple-middleware)

```js
let restVerb = router[methods.http]
restVerb.call(restVerbMethod, route, ...routeMws);
```

TODO: more API docs

### Wrapper

Standard Feathers service method wrapper for routes

```js
function createWrapper(method, getArgs, opts) {
  return service => {
    // return function to handle a service request for given app framework
    // (such as express or koa)
    return routeHandler
    }
  }
}
```

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
