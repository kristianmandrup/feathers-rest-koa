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

Under development!

Using and based on `major` branches from [feathers](https://github.com/feathersjs/feathers) and [feathers-rest](https://github.com/feathersjs/feathers-rest).

We might need a [feathers-koa](https://github.com/kristianmandrup/feathers-koa) package, similar to [feathers-express](https://github.com/feathersjs/feathers-express).

`feathers-express` exports a function (by convention known as `expressify`) to wrap a feathers app for that particular web application framework.

Please help work on [feathers-koa](https://github.com/kristianmandrup/feathers-koa) to make it a reality!

## About

This provider exposes [Feathers](http://feathersjs.com) services through a RESTful API using [Koa](http://koajs.com) that can be used with Feathers 1.x and 2.x as well as client support for Fetch, jQuery, Request, Superagent, axios and angular2+'s HTTP Service.

__Note:__ For the full API documentation go to [https://docs.feathersjs.com/api/rest.html](https://docs.feathersjs.com/api/rest.html).

## Client

The REST client has been extracted. In the future it will likely be in a separate repo `feathers-rest-client`.

## Quick example

You can optionally pass options to `rest` function to customize the internal behavior as needed (see *rest method* section below for details and example)

```js
rest(opts)
```

Basic config, using default `rest` setup.

```js
import Koa from 'koa';
import feathers from 'feathers';
import bodyParser from 'koa-bodyparser'
import rest from 'feathers-rest-koa';

const koa = new Koa()
const app = feathers(koa)
  .configure(rest()) // <-- configure with Koa REST
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
import {
  defaultConfigJson,
  defaultConfigFeathersRest,
  defaultRegister
} from './koa'

export default function rest(opts = {}) {
  return function () {
    const app = this;
    let configJson = opts.configJson || defaultConfigJson
    configJson(app, opts)

    let configFeathersRest = opts.configJson || defaultConfigFeathersRest
    configFeathersRest(app, opts)

    app.rest = wrappers;
    let register = opts.register || defaultRegister;
    register(app, opts);
  };
}
```

You can now pass in custom config/register functions via the `opts` parameter.
Note: Each of the optional functions have the signature `(app, opts)`

```js
let opts = {
  configJson,
  configFeathersRest,
  register: (app, opts) => {
    // ...
  }
}
let app = feathers()
  .configure(rest(opts))
```

## Development

Start from the `test/express` folder and make sure that the routes added by the `Routes` class work as required by feathers. Then move on to `test/koa` ;)

Try running the simple `major` test on express:

`$ mocha test/express/major.test.js`

Same test suite for koa:

`$ mocha test/koa/major.test.js`

We likely need to create a `koaify` method, similar to `expressify` from [feathers-express](https://github.com/feathersjs/feathers-express).

See [feathers-koa](https://github.com/kristianmandrup/feathers-koa).

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

Main issue is how to add the mws to Koa for a given route. Perhaps should be done more centrally? Please advice

```js
  // route here is the name for now (in Koa Routes class)
  // route is a real route object for express
  configRouteMws(route, httpMethod, routeMws) {
    this.error('configRouteMw: how to add route Mw for Koa!?')
  }
```

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
