import makeDebug from 'debug';
const debug = makeDebug('feathers:rest');

const RESTmethods = {
  get: 'find',
  post: 'create',
  patch: 'patch',
  put: 'update',
  delete: 'remove'
};

export class BaseRoutes {
  constructor(app, opts = {}) {
    this.logging = opts.logging;
    this.log('constructor', {
      app,
      opts
    })
    this.app = app;
    this.providers = app.providers || []

  }

  get label() {
    return `Routes #{this.provider}:`
  }

  log(...msgs) {
    if (!this.logging) return;
    console.log(this.label, ...msgs);
  }

  error(msg, obj) {
    console.error(`${this.label} #{msg}`, obj)
    throw new Error(`${this.label} #{msg}`)
  }

  get provider() {
    this.error('provider must be set by subclass')
  }

  set uri(_uri) {
    this._uri = _uri;
    this.configure(_uri);
  }

  configure(uri) {
    this.baseRoutePath = uri;
    this.idRoutePath = `${uri}/:__feathersId`;
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

    this.service = service
    this.middleware = middleware
    this.after = after
    this.before = before

    debug(`Adding REST provider for service \`${path}\` at base route \`${uri}\``);

    this.configAll()
  }

  configAll() {
    this.log('configAll')
    this
      .configRoutes()
  }

  configRoutes() {
    this.log('configRoutes')
    this
      .configBaseRoute()
      .configIdRoute()

    return this
  }

  configRoute(route, httpMethod, serviceMethod) {
    let {
      app,
      before,
      after,
      service,
    } = this;

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
      this.error('configRoute: bad or missing rest factory', {
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

    this.configRouteMws(route, httpMethod, routeMws)
    this.addRoute(httpMethod, route, routeFun)
  }

  configRouteMws(route, httpMethod, routeMws) {
    console.error('configRouteMws: subclass must define how to add the routeMws middlewares')
  }

  configRouteMethods(route, methodMap = {}) {
    let methods = Object.keys(methodMap);
    methods.map((httpMethod) => {
      let serviceMethod = methodMap[httpMethod];
      this.configRoute(route, httpMethod, serviceMethod);
    });
  }

  configBaseRoute() {
    this.log('configBaseRoute')
    this.configRouteMethods(this.baseRoute, RESTmethods);
    return this;
  }

  configIdRoute() {
    this.log('configIdRoute')
    this.configRouteMethods(this.idRoute, RESTmethods);
    return this;
  }

  addRoute(httpMethod, route, routeFun) {
    this.log('adding route', {
      router: this.router,
      httpMethod,
      route,
      // routeFun
    });
  }

  addRouter() {
    throw new Error('Routes subclass missing addRouter() function')
  }
}
