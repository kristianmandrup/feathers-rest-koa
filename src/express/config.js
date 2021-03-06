import makeDebug from 'debug';
import {
  createRoutes
} from './routes';

const debug = makeDebug('feathers-rest-koa');

import {
  BaseConfig
} from '../base/config'

export function formatter(req, res, next) {
  if (res.data === undefined) {
    return next();
  }

  res.format({
    'application/json': function () {
      res.json(res.data);
    }
  });
}

export function config(app, opts) {
  return new ExpressConfig(app, opts).configure()
}

export class ExpressConfig extends BaseConfig {
  constructor(app, opts = {}) {
    super(app, opts)
  }

  get label() {
    return 'ExpressConfig'
  }

  configJson() {
    let {
      app
    } = this
    this.log('no JSON config defined for Express app')
    return this
  }

  configProvider() {
    this.log('configProvider')
    let {
      app
    } = this

    if (!app.version || app.version < '3.0.0') {
      throw new Error(`feathers-rest requires an instance of a Feathers application version 3.x or later (got ${app.version})`);
    }

    app.use(function (req, res, next) {
      req.feathers = {
        provider: 'rest'
      };
      next();
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

    if (typeof app.route !== 'function') {
      throw new Error('feathers-rest needs an Express compatible app. Feathers apps have to wrapped with feathers-express first.');
    }

    const routes = createRoutes(app, opts)
    routes.registerProvider();
    return this
  }
}
