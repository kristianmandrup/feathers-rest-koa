import {
  BaseRoute
} from '../base/route'

export function createRoute(app, path, config, opts) {
  return new ExpressRoute(app, path, config, opts)
}

export class ExpressRoute extends BaseRoute {
  constructor(rest, route, methods, opts = {}) {
    super(rest, route, methods, opts)
  }

  get label() {
    return 'ExpressRoute'
  }

  addRouteMws(routeMws, methods) {
    this.log('addRouteMws', {
      methods,
      routeMws
    })
    let {
      route
    } = this
    let routeVerb = route[methods.http]
    routeVerb(...routeMws);
    this.log('added route with middleware', route)
    return this
  }
}
