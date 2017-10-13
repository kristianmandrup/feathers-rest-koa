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

## Development

Please start from the `test/koa` folder and make sure that the routes added by the `Routes` class function as expected/required by feathers. Then move on from there ;)

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
