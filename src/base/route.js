import {
  Logger
} from './logger'

const RESTmethods = {
  get: 'find',
  post: 'create',
  patch: 'patch',
  put: 'update',
  delete: 'remove'
};

export class BaseRoute extends Logger {
  constructor(app, path, config, opts = {}) {
    super(opts)
    this.app = app
    this.path = path
    this.config = config
    this.router = opts.router
  }

  configure(route, httpMethod, serviceMethod) {
    let {
      app,
      before,
      after,
      service,
    } = this.config;

    this.log('configRoute', {
      httpMethod,
      serviceMethod,
      before,
      after
    });

    // baseRoute.get(...before, app.rest.find(service), ...after);
    // baseRoute.get(...before, restMethod, ...after);
    let restFactory = app.rest[serviceMethod]

    if (!restFactory) {
      this.error('configRoute: bad or missing rest factory on feathers app', {
        serviceMethod,
        rest: app.rest
      })
    }

    let restMethod = restFactory(service);
    let routeMws = [...before, restMethod, ...after]
    this.log('configRoute', {
      restMethod,
      routeMws
    });

    this.addMws(route, httpMethod, routeMws)
    this.addToRouter(httpMethod, route, routeFun)
  }

  addRouteMethods(route, methodMap = {}) {
    let methods = Object.keys(methodMap);
    methods.map((httpMethod) => {
      let serviceMethod = methodMap[httpMethod];
      this.addRoute(route, httpMethod, serviceMethod);
    });
  }

  addMws(route, httpMethod, routeMws) {
    this.notImplemented('addMws')
  }

  addToRouter(httpMethod, route, routeFun) {
    this.notImplemented('addToRouter')
  }
}
