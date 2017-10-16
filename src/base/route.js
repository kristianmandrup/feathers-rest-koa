import {
  Logger
} from './logger'

export class BaseRoute extends Logger {
  constructor(rest, path, methods, opts = {}) {
    super(opts)
    this.path = path
    this.methods = methods
    this.rest = rest
  }

  get label() {
    return 'Route'
  }

  // add/configure route
  configure() {
    let {
      config,
      app
    } = this.rest
    let {
      before,
      after,
      service,
    } = config;

    this.log('configure', {
      before,
      after,
      config
    });

    let {
      methods,
    } = this
    let {
      rest
    } = app

    let {
      serviceAction,
      reqMethod
    } = methods

    // baseRoute.get(...before, app.rest.find(service), ...after);
    // baseRoute.get(...before, restMethod, ...after);
    let restFactory = rest[serviceAction]

    if (!restFactory) {
      this.error('configure: bad or missing rest factory on feathers app', {
        serviceAction,
        rest
      })
    }

    let serviceMethod = restFactory(service);
    let routeMws = [...before, serviceMethod, ...after]
    this.log('configure', {
      methods,
      routeMws
    });

    this.addRouteMws(routeMws, methods)
    this.postConfig(methods)
    return this
  }

  postConfig(methods) {
    this.log('postConfig not implemented')
    // this.notImplemented('postConfig')
  }
}
