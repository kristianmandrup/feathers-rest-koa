import makeDebug from 'debug';
const debug = makeDebug('feathers:rest');
import {
  BaseRoutes
} from '../base/routes'
import {
  createRoute
} from './route'

export function createRoutes(app, opts = {}) {
  return new Routes(app, opts);
}

// FIX: Use Express router
export class Routes extends BaseRoutes {
  constructor(app, opts = {}) {
    super(app, opts)
    this.router = opts.router || this.createRouter()
  }

  get label() {
    return 'Routes'
  }

  // TODO: create Express router
  createRouter() {
    // this.notImplemented('createRouter')
  }

  get provider() {
    return 'express'
  }

  configure(uri) {
    super.configure(uri)
    this.addRoutes()
  }

  addRoutes() {
    let routeNames = Object.keys(this.routeMap)

    this.routesNames.map(name => {
      let path = this.routeMap[name]
      let route = this.createRoute(path)
      this.routes.push(route)
    })
    return this
  }

  createRoute(path) {
    return app.route(path);
  }

  createRestRoute(path) {
    // imported from route.js
    createRoute(this.app, path, this.config, this.opts)
  }
}
