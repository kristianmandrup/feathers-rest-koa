import makeDebug from 'debug';
const debug = makeDebug('feathers:rest');
import {
  Logger
} from './logger'

export function invert(obj) {
  return Object.assign({}, ...Object.entries(obj).map(([a, b]) => ({
    [b]: a
  })))
}

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

  set uri(uri) {
    this.log('set uri,', uri)
    this._uri = uri;
    this.configure();
  }

  get uri() {
    return this._uri
  }

  configure() {
    let {
      uri
    } = this
    this.log('configure', {
      uri
    })
    let routeMap = {
      base: uri,
      id: `${uri}/:__feathersId`
    }
    let invertedMap = invert(routeMap)

    let routeNames = Object.keys(routeMap)
    this.routeMap = routeMap
    this.routeNames = routeNames
    this.invertedMap = invertedMap
    this.log('configured', {
      routeNames,
      routeMap
    })
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
    const uri = `/${path}`;
    this.log('registerRest', {
      service,
      path,
      options,
      uri
    })

    this.service = service
    this.uri = uri
    this.prepareConfig(options)

    debug(`Adding REST provider for service \`${path}\` at base route \`${uri}\``);

    this.addRoutes()
    this.postConfig()
  }

  prepareConfig(options) {
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
      middleware,
      after,
      before,
      service: this.service,
      router: this.router
    }
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
    let {
      routeMap,
      routes
    } = this
    let path = routeMap[name]
    this.log('addRest', {
      name,
      path
    })
    let route = this.createRest(path)
    routes[name] = route
    this.log('Rest route added', {
      routes
    })
    return route
  }

  createRest(path) {
    this.opts.path = path
  }

  postConfig() {
    this.log('postConfig')
  }
}
