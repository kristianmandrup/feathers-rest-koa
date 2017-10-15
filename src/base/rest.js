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
  constructor(app, path, config, opts = {}) {
    super(opts)
    console.log('create BaseRest', {
      app,
      path,
      config,
      opts
    })
    this.app = app
    this.path = path
    this.route = path
    this.config = config
    this.router = config.router

    this.createRoute = opts.createRoute || this.createRoute
    this.createRoute.bind(this)

    this.configure()
  }

  get label() {
    return 'Rest'
  }

  // override to create route from path or whatever
  configure() {
    this.addRouteMethods()
  }

  addRouteMethods() {
    let reqMethods = Object.keys(reqServiceMap);
    reqMethods.map(reqMethod => this.addRouteMethod(reqMethod));
    return this
  }

  addRouteMethod(reqMethod) {
    let serviceAction = reqServiceMap[reqMethod];
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
    this.createRoute(route, methods)
  }
}
