import makeDebug from 'debug';
import {
  createRoutes
} from './routes';

const debug = makeDebug('feathers-rest-koa');

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

export function defaultRegisterRest(app, opts = {}) {
  registerRest(app, opts);
}

export function defaultConfigJson(app, opts) {
  console.log('no JSON config defined for Express app')
}

export function defaultConfigFeathersRest(app, opts) {
  if (!app.version || app.version < '3.0.0') {
    throw new Error(`feathers-rest requires an instance of a Feathers application version 3.x or later (got ${app.version})`);
  }

  app.use(function (req, res, next) {
    req.feathers = {
      provider: 'rest'
    };
    next();
  });
}

export function registerRest(app, opts = {}) {
  if (typeof app.route !== 'function') {
    throw new Error('feathers-rest needs an Express compatible app. Feathers apps have to wrapped with feathers-express first.');
  }

  const routes = createRoutes(app, {
    logging: opts.logging
  });
  routes.registerProvider();
  return app
}
