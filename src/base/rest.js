import {
  Logger
} from './logger'

const reqServiceMap = {
  get: 'find',
  post: 'create',
  patch: 'patch',
  put: 'update',
  delete: 'remove'
};

export class BaseRest extends Logger {
  constructor(app, config = {}, opts = {}) {
    super(opts)
    this.app = app
    this.path = opts.path
    this.config = config
    this.router = config.router
    this.reqServiceMap = reqServiceMap

    this.createRoute = opts.createRoute || this.createRoute
    this.createRoute.bind(this)
  }

  get label() {
    return 'Rest'
  }

  // override to create route from path or whatever
  configure() {
    this.log('configure')
    this.addRouteMethods()
    return this
  }

  addRouteMethods() {
    this.log('addRouteMethods')
    let reqMethods = Object.keys(this.reqServiceMap);
    reqMethods.map(reqMethod => this.addRouteMethod(reqMethod));
    return this
  }

  addRouteMethod(reqMethod) {
    this.log('addRouteMethod', {
      reqMethod
    })
    let serviceAction = this.reqServiceMap[reqMethod];
    this.addRoute({
      reqMethod,
      serviceAction
    });
  }

  createRoute(route, methods) {
    this.notImplemented('createRoute')
  }

  addRoute(methods) {
    let {
      route
    } = this
    this.log('addRoute', {
      route,
      methods
    })
    this.createRoute(route, methods)
  }
}
