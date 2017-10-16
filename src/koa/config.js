import jsonBody from 'koa-json-body';
import {
  createRoutes
} from './routes';

import makeDebug from 'debug';
const debug = makeDebug('feathers-rest-koa');

import {
  BaseConfig
} from '../base/config'

export function config(app, opts) {
  return new KoaConfig(app, opts).configure()
}

export class KoaConfig extends BaseConfig {
  constructor(app, opts = {}) {
    super(app, opts)
  }

  get label() {
    return 'KoaConfig'
  }

  configJson() {
    let {
      app,
      opts
    } = this
    let jsonOpts = Object.assign({
      limit: '10kb',
      fallback: true
    }, opts);
    let jsonHandler = opts.handler || jsonBody(jsonOpts);
    this.log('configJson add jsonHandler to app', {
      app,
      jsonHandler
    })
    app.use(jsonHandler);
    return this
  }

  configProvider() {
    let {
      app,
      opts
    } = this
    if (!app.version || app.version < '3.0.0') {
      throw new Error(`feathers-rest requires an instance of a Feathers application version 3.x or later (got ${app.version})`);
    }

    app.use(async function (ctx, next) {
      ctx.feathers = {
        provider: 'rest'
      };
      await next();
    });
    return this
  }

  configRest() {
    let {
      app,
      opts
    } = this
    this.log('configRest', {
      app,
      opts
    })
    const routes = createRoutes(app, {
      logging: opts.logging
    })
    routes.registerProvider();
    return this
  }
}
