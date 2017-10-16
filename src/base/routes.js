import makeDebug from 'debug';
const debug = makeDebug('feathers:rest');
import {
  Logger
} from './logger'

export class BaseRoutes extends Logger {
  constructor(app, opts = {}) {
    super(opts)
    this.app = app;
    this.providers = app.providers || []
    this.routes = {}
    this.router = opts.router || this.createRouter()

    this.createRest = opts.createRest || this.createRest
    this.createRest.bind(this)
  }

  get label() {
    return 'Routes'
  }

  // such as express or koa
  get providerName() {
    this.error('provider must be set by subclass')
  }

  createRouter() {
    this.warn('createRouter not implemented')
    // this.notImplemented('createRouter')
  }

  set uri(_uri) {
    this._uri = _uri;
    this.configure(_uri);
  }

  configure(uri) {
    this.routeMap = {
      base: uri,
      id: `${uri}/:__feathersId`
    }
    this.routeNames = Object.keys(routeMap)
    return this
  }

  registerProvider() {
    let registerFun = this.registerRest.bind(this)
    this.log('registerProvider: adding provider registration callback to app providers', {
      providers: this.providers,
      registerFun
    })
    this.providers.push(registerFun)
  }

  // Register the REST provider
  registerRest(service, path, options) {
    this.log('registerRest', {
      service,
      path,
      options
    })
    const uri = `/${path}`;
    this.uri = uri

    let {
      middleware = {}
    } = options;
    let {
      before = [], after = []
    } = middleware;

    if (typeof handler === 'function') {
      after = after.concat(handler);
    }

    this.config = {
      service,
      middleware,
      after,
      before,
      router: this.router
    }

    debug(`Adding REST provider for service \`${path}\` at base route \`${uri}\``);

    this.addRoutes()
    this.postConfig()
  }

  addRoutes() {
    let {
      routeMap,
      routeNames
    } = this
    if (!routeMap) {
      this.error('routeMap must first be initialized by setting uri')
    }


    this.log('addRoutes:', {
      routeNames,
      routeMap
    })

    routeNames.map(name => {
      this.addRest(name)
    })
    return this
  }

  addRest(name) {
    let path = this.routeMap[name]
    let route = this.createRest(path)
    this.routes[name] = route
    return route
  }

  createRest(path) {
    this.notImplemented('createRest')
  }

  postConfig() {
    this.log('postConfig not implemented')
  }
}
