// TODO: use koa-routes
import Router from 'koa-router';
const RESTmethods = {
  get: 'find',
  post: 'create',
  patch: 'patch',
  put: 'update',
  delete: 'remove'
};

export function createRoutes (app, opts = {}) {
  return new Routes(app, opts);
}

export class Routes {
  constructor (app, opts = {}) {
    this.router = Router();
    this.app = app;

    let {
      before,
      after,
      service
    } = opts;

    this.before = before;
    this.after = after;
    this.service = service;
  }

  set uri (_uri) {
    this._uri = _uri;
    this.configure(_uri);
  }

  configure (uri) {
    // this.baseRoute = app.route(uri);
    // this.idRoute = app.route(`${uri}/:__feathersId`);

    // TODO: use koa router, should be names only
    this.baseRoute = uri;
    this.idRoute = `${uri}/:__feathersId`;
  }

  configAll () {
    this
      .configRoutes()
      .addRouter();
  }

  configRoutes () {
    this
      .configBaseRoute()
      .configIdRoute();
  }

  configRoute (route, httpMethod, serviceMethod) {
    let {
      app,
      before,
      after,
      service,
      router
    } = this;

    // TODO: fix for koa
    router[httpMethod].apply(route, before.concat(app.rest[serviceMethod](service), after));
  }

  configRouteMethods (route, methodMap = {}) {
    let methods = Object.keys(methodMap);
    methods.map((httpMethod) => {
      let serviceMethod = methodMap[httpMethod];
      this.configRoute(route, httpMethod, serviceMethod);
    });
  }

  configBaseRoute () {
    this.configRouteMethods(this.baseRoute, RESTmethods);
    return this;
  }

  configIdRoute () {
    this.configRouteMethods(this.idRoute, RESTmethods);
    return this;
  }

  addRouter () {
    let { app, router } = this;
    app
      .use(router.routes())
      .use(router.allowedMethods());

    return this;
  }
}
