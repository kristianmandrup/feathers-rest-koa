import {
  BaseRoute
} from '../base/route'

export function createRoute(app, path, config, opts) {
  return new ExpressRoute(app, path, config, opts)
}

export class ExpressRoute extends BaseRoute {
  constructor(rest, path, methods, opts = {}) {
    super(rest, path, methods, opts)
  }

  get label() {
    return 'ExpressRoute'
  }

  addRouteMws(routeMws, methods) {
    let {
      route
    } = this
    let {
      reqMethod
    } = methods
    this.log('addRouteMws', {
      methods,
      routeMws,
      route,
      reqMethod
    })
    let routeVerb = route[reqMethod]
    routeVerb(...routeMws);
    this.log('added route with middleware', route)
    return this
  }
}
