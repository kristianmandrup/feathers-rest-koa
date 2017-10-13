import makeDebug from 'debug';
import wrappers from './wrappers';
import {
  createRoutes
} from './app/routes';
import jsonBody from 'koa-json-body';

const debug = makeDebug('feathers-rest-koa');

export function createRegistrator(app) {
  return function (path, service, options) {
    const uri = path.indexOf('/') === 0 ? path : `/${path}`;

    // feathers middleware
    let middleware = (options || {}).middleware || {};
    let before = middleware.before || [];
    let after = middleware.after || [];

    const routes = createRoutes(app, {
      before,
      after,
      service
    });
    routes.uri = uri;
    routes.configAll();
    debug(`Adding REST provider for service \`${path}\` at base route \`${uri}\``);
  };
}

export class Registrator {
  constructor(app) {
    this.app = app;
  }

  register() {
    let {
      app
    } = this;
    let registrator = createRegistrator(app);
    // Register the REST provider
    app.providers.push(registrator);
    return app;
  }
}

export function defaultRegister(app) {
  new Registrator(app).register();
}

export default function rest(opts = {}) {
  return function () {
    const app = this;

    let jsonOpts = Object.assign({
      limit: '10kb',
      fallback: true
    }, opts);
    let jsonHandler = opts.handler || jsonBody(jsonOpts);

    app.use(jsonHandler);

    app.use(async function (ctx, next) {
      ctx.feathers = {
        provider: 'rest'
      };
      await next();
    });

    app.rest = wrappers;
    let register = opts.register || defaultRegister;
    register(app, opts);
  };
}
