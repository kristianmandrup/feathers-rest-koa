// TODO: use koa-routes
import Router from 'koa-router';
import {
  BaseRoutes
} from '../base/routes'

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
    this.router = Router();
  }

  get provider() {
    return 'koa'
  }

  configRouteMws(route, httpMethod, routeMws) {
    this.error('configRouteMw: how to add route Mw for Koa!?')
  }

  configBaseRoute() {
    this.configRouteMethods(this.baseRoutePath, RESTmethods);
    return this;
  }

  configIdRoute() {
    this.configRouteMethods(this.idRoutePath, RESTmethods);
    return this;
  }

  configAll() {
    super.configAll()
    this
      .addRouter()
  }

  addRoute(httpMethod, route, routeFun) {
    this.log('adding route', {
      router: this.router,
      httpMethod,
      route,
      // routeFun
    });
    this.router[httpMethod](route, routeFun);
  }

  addRouter() {
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
