import makeDebug from 'debug';
import wrappers from './wrappers';
import Routes from './app/routes'
import format from 'koa-format'

const debug = makeDebug('feathers-rest-koa');

export function async formatter(ctx, next) {
  if (ctx.body === undefined) {
    await next();
  }

  ctx.format({
    'application/json': function () {
      ctx.json(res.body);
    }
  });
}

export function createRegistrator(app) {
  return function (path, service, options) {
    const uri = path.indexOf('/') === 0 ? path : `/${path}`;

    let middleware = (options || {}).middleware || {};
    let before = middleware.before || [];
    let after = middleware.after || [];

    if (typeof handler === 'function') {
      after = after.concat(handler);
    }

    const routes = new Routes(app, {
      before,
      after,
      service
    })
    routes.uri = uri      
    routes.configBaseRoute()
    routes.configIdRoute()

    debug(`Adding REST provider for service \`${path}\` at base route \`${uri}\``);
  }
}

export class Registrator {
  constructor(app) {
    this.app = app
  }

  register() {
    let { app } = this
    let registrator = createRegistrator(app)
    // Register the REST provider
    app.providers.push(registrator);
    return app
  }
}

export function defaultRegister(app) {
  new Registrator(app).register()
}

export default function rest(handler = formatter, opts = {}) {
  return function () {
    const app = this;

    app.use(format(opts.formatSchema, opts))

    app.use(async function (ctx, next) {
      ctx.feathers = {
        provider: 'rest'
      };
      await next()
    });

    app.rest = wrappers;
    let register = opts.register || defaultRegister
    register(app)
  };
}

rest.formatter = formatter;
