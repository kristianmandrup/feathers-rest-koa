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
    this.router = this.createRouter()
  }

  createRouter() {
    return new Router()
  }

  get provider() {
    return 'koa'
  }

  createRoute(path) {
    this.notImplemented(createRoute)
  }

  createRestRoute(path) {
    // imported from route.js
    createRoute(this.app, path, this.config, this.opts)
  }

  configure(uri) {
    super.configure(uri)
    this.addRoutes()
  }

  addRouteMws(route, httpMethod, routeMws) {
    this.error('configRouteMw: how to add route Mw for Koa!?')
  }

  addRoute(httpMethod, route, routeFun) {
    this.log('adding route', {
      router: this.router,
      httpMethod,
      route,
      // routeFun
    });

    // create route via router
    // is this correct or just guessing? we need to get handle to route object created
    this.route = this.router[httpMethod](route, routeFun);
    return this
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
