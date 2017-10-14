import makeDebug from 'debug';
const debug = makeDebug('feathers:rest');
import {
  BaseRoutes
} from '../base/routes'

export function createRoutes(app, opts = {}) {
  return new Routes(app, opts);
}

export class Routes extends BaseRoutes {
  constructor(app, opts = {}) {
    super(app, opts)
  }

  get provider() {
    return 'express'
  }

  configure(uri) {
    super(uri)
    this.configureAppRoutes()
  }

  configRouteMws(route, httpMethod, routeMws) {
    route[httpMethod].apply(route, routeMws);
  }

  configureAppRoutes() {
    this.baseRoute = app.route(this.baseRoutePath);
    this.idRoute = app.route(idRoutePath);
  }
}
