import jsonBody from 'koa-json-body';
import {
  createRoutes
} from './routes';
import makeDebug from 'debug';
const debug = makeDebug('feathers-rest-koa');

export function configJson(app, opts) {
  let jsonOpts = Object.assign({
    limit: '10kb',
    fallback: true
  }, opts);
  let jsonHandler = opts.handler || jsonBody(jsonOpts);
  app.use(jsonHandler);
}

export function configProvider(app, opts) {
  if (!app.version || app.version < '3.0.0') {
    throw new Error(`feathers-rest requires an instance of a Feathers application version 3.x or later (got ${app.version})`);
  }

  app.use(async function (ctx, next) {
    ctx.feathers = {
      provider: 'rest'
    };
    await next();
  });
}

export function configRest(app, opts = {}) {
  const routes = createRoutes(app, {
    logging: opts.logging
  }).registerProvider();
  return app
}

export const defaults = {
  configJson,
  configProvider,
  configRest
}
