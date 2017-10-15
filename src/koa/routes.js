// TODO: use koa-routes
import Router from 'koa-router';
import {
  BaseRoutes
} from '../base/routes'
import {
  createRoute
} from './route'

const RESTmethods = {
  get: 'find',
  post: 'create',
  patch: 'patch',
  put: 'update',
  delete: 'remove'
};

export function createRoutes(app, opts = {}) {
  return new Routes(app, opts);
}

export class Routes extends BaseRoutes {
  constructor(app, opts = {}) {
    super(app, opts)
    this.createRestRoute = opts.createRestRoute || this._createRestRoute
    this.createRestRoute.bind(this)
  }

  get label() {
    return 'Routes'
  }

  createRouter() {
    return new Router()
  }

  get provider() {
    return 'koa'
  }

  createRoute(path) {
    this.notImplemented('createRoute')
  }

  _createRestRoute(path) {
    // imported from route.js
    return createRoute(this.app, path, this.config, this.opts)
  }

  configure(uri) {
    super.configure(uri)
    this.addRoutes()
  }

  addRouterToApp() {
    let {
      app,
      router
    } = this;

    app
      .use(router.routes())
      .use(router.allowedMethods());

    return this;
  }
}
