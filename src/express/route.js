import {
  BaseRoute
} from '../base/route'

export function createRoute(app, path, config, opts) {
  return new ExpressRoute(app, path, config, opts)
}

export class ExpressRoute extends BaseRoute {
  constructor(rest, path, methods, opts = {}) {
    super(rest, path, methods, opts)
    this.log('ExpressRoute', opts)
    this.route = opts.route
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
    let routeVerb = route[reqMethod]
    if (typeof routeVerb !== 'function') {
      this.error('no such route method', {
        route,
        reqMethod
      })
    }

    this.log('addRouteMws', {
      methods,
      routeMws,
      route,
      reqMethod,
      routeVerb
    })

    if (routeMws.length === 1) {
      routeVerb(routeMws[0]);
    } else {
      routeVerb(...routeMws);
    }

    this.log('added route with middleware', {
      firstMw: routeMws[0],
      route,
      routeVerb
    })
    return this
  }
}
