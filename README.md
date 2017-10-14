# feathers-rest-koa

[![Greenkeeper badge](https://badges.greenkeeper.io/feathersjs/feathers-rest-koa.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/feathersjs/feathers-rest-koa.png?branch=master)](https://travis-ci.org/feathersjs/feathers-rest-koa)
[![Code Climate](https://codeclimate.com/github/feathersjs/feathers-rest-koa/badges/gpa.svg)](https://codeclimate.com/github/feathersjs/feathers-rest-koa)
[![Test Coverage](https://codeclimate.com/github/feathersjs/feathers-rest-koa/badges/coverage.svg)](https://codeclimate.com/github/feathersjs/feathers-rest-koa/coverage)
[![Dependency Status](https://img.shields.io/david/feathersjs/feathers-rest-koa.svg?style=flat-square)](https://david-dm.org/feathersjs/feathers-rest-koa)
[![Download Status](https://img.shields.io/npm/dm/feathers-rest-koa.svg?style=flat-square)](https://www.npmjs.com/package/feathers-rest-koa)
[![Slack Status](http://slack.feathersjs.com/badge.svg)](http://slack.feathersjs.com)

> The Feathers REST API provider

## About

This provider exposes [Feathers](http://feathersjs.com) services through a RESTful API using [Koa](http://koajs.com) that can be used with Feathers 1.x and 2.x as well as client support for Fetch, jQuery, Request, Superagent, axios and angular2+'s HTTP Service.

__Note:__ For the full API documentation go to [https://docs.feathersjs.com/api/rest.html](https://docs.feathersjs.com/api/rest.html).

## Client

The REST client has been extracted. In the future it will likely be in a separate repo `feathers-rest-client`.

## Quick example

You can pass a `formatter` and additional `options` to the `rest` function.

```js
rest(formatter, opts)
```

```js
import Koa from 'koa';
import feathers from 'feathers';
import bodyParser from 'koa-bodyparser'
import rest from 'feathers-rest-koa';

const koa = new Koa()
const app = feathers(koa)
  .configure(rest())
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

## Client use

On the client use `feathers-rest/client`

```js
import feathers from 'feathers/client';
import rest from 'feathers-rest/client';

import jQuery from 'jquery';
import request from 'request';
import superagent from 'superagent';
import axios from 'axios';
import {Http, Headers} from '@angular/http';


const app = feathers()
  .configure(rest('http://baseUrl').jquery(jQuery))
  // or
  .configure(rest('http://baseUrl').fetch(window.fetch.bind(window)))
  // or
  .configure(rest('http://baseUrl').request(request))
  // or
  .configure(rest('http://baseUrl').superagent(superagent))
  // or
    .configure(rest('http://baseUrl').axios(axios))
  // or (using injected Http instance)
    .configure(rest('http://baseUrl').angular(http, { Headers }))
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

The main `rest` method has been made more generic and customisable.

```js
export default function rest(opts = {}) {
  return function () {
    const app = this;
    let configJson = opts.configJson || koaConfigJson
    configJson(app, opts)

    let configFeathersRest = opts.configJson || koaConfigFeathersRest
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

Start from the `test/koa` folder and make sure that the routes added by the `Routes` class work as required by feathers. Then move on from there ;)

Try running the simple `get` test:

`$ mocha test/services/get.test.js`

Currently the problem is that feathers doesn't seem to add the Koa REST routes via `.use`, as in `test/config.js`:

```js
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

We likely need to integrate the work done in [feathers#major](https://github.com/feathersjs/feathers-rest/tree/major) (v3) branch.

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
