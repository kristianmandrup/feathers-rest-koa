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

  get label() {
    return 'Route'
  }

  // { methods: httpMethod, service: serviceMethod}
  configure(route, methods) {
    let {
      app,
      before,
      after,
      service,
    } = this.config;

    this.log('configure', {
      methods,
      before,
      after
    });

    // baseRoute.get(...before, app.rest.find(service), ...after);
    // baseRoute.get(...before, restMethod, ...after);
    let restFactory = app.rest[methods.service]

    if (!restFactory) {
      this.error('configure: bad or missing rest factory on feathers app', {
        service: methods.service,
        rest: app.rest
      })
    }

    let restMethod = restFactory(service);
    let routeMws = [...before, methods.rest, ...after]
    this.log('configure', {
      methods,
      routeMws
    });

    this.addMws(route, routeMws, methods)
    this.postConfig(route, methods)
  }

  addRouteMethods(route, methodMap = {}) {
    let methods = Object.keys(methodMap);
    methods.map((httpMethod) => {
      let serviceMethod = methodMap[httpMethod];
      this.addRoute(route, httpMethod, serviceMethod);
    });
  }

  postConfig(route, methods) {
    this.log('postConfig not implemented')
    // this.notImplemented('postConfig')
  }
}
