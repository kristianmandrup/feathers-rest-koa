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
    throw Error('logging')
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
    let routeFuns = before.concat(restMethod, after);
    let routeFun = async function (next) {
      let promises = routeFuns.map(async fun => await fun(next))
      return await Promise.all(promises)
    }

    this.log('configRoute', {
      restMethod,
      routeFun
    });

    this.addRoute(httpMethod, route, routeFun)
  }

  addRoute(httpMethod, route, routeFun) {
    this.log('adding route', {
      router: this.router,
      httpMethod,
      route,
      routeFun
    });
    console.error(httpMethod, route, routeFun)

    this.router[httpMethod](route, routeFun);
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
