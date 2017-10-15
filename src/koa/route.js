import {
  BaseRoute
} from '../base/route'

export function createRoute(app, path, config, opts) {
  return new KoaRoute(app, path, config, opts)
}

export class KoaRoute extends BaseRoute {
  constructor(rest, route, methods, opts = {}) {
    super(rest, route, methods, opts)
  }

  get label() {
    return 'KoaRoute'
  }

  addRouteMws(routeMws, methods) {
    this.log('addRouteMws', {
      methods,
      routeMws
    })
    let {
      route,
      router
    } = this

    let restVerb = router[methods.http]
    // As per: https://github.com/alexmingoia/koa-router#multiple-middleware
    restVerb.call(restVerbMethod, route, ...routeMws);
    this.log('added route with middleware', route)
    return this
  }
}
