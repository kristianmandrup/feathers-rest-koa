// TODO: use koa-routes
import Router from 'koa-router';
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

export class Routes {
  constructor(app, opts = {}) {
    this.router = Router();
    this.app = app;
    this.logging = opts.logging;

    let {
      before,
      after,
      service
    } = opts;

    this.before = before;
    this.after = after;
    this.service = service;
  }

  log(...msgs) {
    if (!this.logging) return;
    console.log(...msgs);
  }

  set uri(_uri) {
    this._uri = _uri;
    this.configure(_uri);
  }

  configure(uri) {
    // this.baseRoute = app.route(uri);
    // this.idRoute = app.route(`${uri}/:__feathersId`);

    // TODO: use koa router, should be names only
    this.baseRoute = uri;
    this.idRoute = `${uri}/:__feathersId`;
  }

  configAll() {
    this
      .configRoutes()
      .addRouter();
  }

  configRoutes() {
    this
      .configBaseRoute()
      .configIdRoute()

    return this
  }

  configRoute(route, httpMethod, serviceMethod) {
    let {
      app,
      before,
      after,
      service,
    } = this;

    this.log('configRoute', {
      before,
      after
    });
    // TODO: fix for koa
    let restMethod = app.rest[serviceMethod](service);
    let routeFun = before.concat(restMethod, after);

    this.log('configRoute', {
      restMethod,
      routeFun
    });

    this.log('adding route', httpMethod, 'to router', router !== null);

    this.addRoute(httpMethod, route, routeFun)
  }

  addRoute(httpMethod, route, routeFun) {
    this.router[httpMethod].apply(route, routeFun);
  }

  configRouteMethods(route, methodMap = {}) {
    let methods = Object.keys(methodMap);
    methods.map((httpMethod) => {
      let serviceMethod = methodMap[httpMethod];
      this.configRoute(route, httpMethod, serviceMethod);
    });
  }

  configBaseRoute() {
    this.configRouteMethods(this.baseRoute, RESTmethods);
    return this;
  }

  configIdRoute() {
    this.configRouteMethods(this.idRoute, RESTmethods);
    return this;
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
