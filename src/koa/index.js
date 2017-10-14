import makeDebug from 'debug';
import {
  createRoutes
} from './routes';
import jsonBody from 'koa-json-body';

export {
  createWrapper
}
from './wrappers'

const debug = makeDebug('feathers-rest-koa');

export function defaultRegisterRest(app, opts = {}) {
  new RestRegistrator(app).register(opts);
}

export function defaultConfigJson(app, opts) {
  let jsonOpts = Object.assign({
    limit: '10kb',
    fallback: true
  }, opts);
  let jsonHandler = opts.handler || jsonBody(jsonOpts);
  app.use(jsonHandler);
}

export function defaultConfigFeathersRest(app, opts) {
  app.use(async function (ctx, next) {
    ctx.feathers = {
      provider: 'rest'
    };
    await next();
  });
}

export function createRestRegistrator(app, opts = {}) {
  return function (path, service, options) {
    const uri = path.indexOf('/') === 0 ? path : `/${path}`;

    // feathers middleware
    let middleware = (options || {}).middleware || {};
    let before = middleware.before || [];
    let after = middleware.after || [];

    const routes = createRoutes(app, {
      before,
      after,
      service,
      logging: opts.logging
    });
    routes.uri = uri;
    routes.configAll();
    debug(`Adding REST provider for service \`${path}\` at base route \`${uri}\``);
  };
}

export class RestRegistrator {
  constructor(app) {
    this.app = app;
  }

  register(opts = {}) {
    let {
      app
    } = this;
    let registrator = createRestRegistrator(app, opts);
    // Register the REST provider
    app.providers.push(registrator);
    return app;
  }
}
