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

// FIX: Use new Express router
export class Routes extends BaseRoutes {
  constructor(app, opts = {}) {
    super(app, opts)
  }

  get provider() {
    return 'express'
  }

  configureAppRoutes() {
    let routeNames = Object.keys(this.routeMap)

    this.routesNames.map(name => {
      let routePath = this.routeMap[name]
      let route = app.route(routePath);
      this.routes.push(route)
    })
    return this
  }

  createRoute(path) {
    // imported from route.js
    createRoute(this.app, path, this.config, this.opts)
  }
}
