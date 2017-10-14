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
  }

  get label() {
    this.notImplemented('label getter')
  }

  get provider() {
    this.error('provider must be set by subclass')
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
  }

  registerProvider() {
    let registerFun = this.registerRest.bind(this)
    this.log('adding provider registration callback to app providers', {
      providers: this.providers,
      registerFun
    })
    this.providers.push(registerFun)
  }

  // Register the REST provider
  registerRest(service, path, options) {
    const uri = `/${path}`;

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
      before
    }

    debug(`Adding REST provider for service \`${path}\` at base route \`${uri}\``);

    this.configAll()
  }

  configAll() {
    this.log('configAll')
    this
      .addRoutes()
  }

  addRoutes() {
    this.log('configRoutes')
    this
      .addRestRoutes('base')
      .addRestRoutes('id')

    return this
  }

  addRestRoutes(id) {
    this.log('configBaseRoute')
    let path = this.routeMap[id]
    let route = this.createRestRoute(path)
    this.routes.push()
    return this;
  }

  createRoute(path) {
    this.notImplemented('createRoute')
  }

  configIdRoute() {
    this.log('configIdRoute')
    this.configRouteMethods(this.idRoute, RESTmethods);
    return this;
  }

  addRouterToApp() {
    this.notImplemented('addRouterToApp')
  }
}
