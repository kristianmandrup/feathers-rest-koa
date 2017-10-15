import {
  BaseRoute
} from '../base/route'

export function createRoute(app, path, config, opts) {
  return new Route(app, path, config, opts)
}

export class Route extends BaseRoute {
  constructor(app, path, config, opts = {}) {
    super(opts)
    console.log('create Route', {
      path,
      config,
      opts
    })
  }

  get label() {
    return 'Route'
  }

  addRoute(httpMethod, route, routeFun) {
    this.log('adding route', {
      router: this.router,
      httpMethod,
      route,
      // routeFun
    });

    // return route.configure(httpMethod, serviceMethod)
    return this
  }

  addRouteMws(routePath, routeMws, methods) {
    this.log('addRouteMws', {
      routePath,
      methods,
      routeMws
    })
    let restVerbMethod = this.router[methods.http]
    // As per: https://github.com/alexmingoia/koa-router#multiple-middleware
    restVerbMethod.call(restVerbMethod, routePath, ...routeMws);
    this.log('added')
    return this
  }
}
