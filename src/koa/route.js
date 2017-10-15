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
    let {
      route
    } = this
    let {
      router
    } = this.rest
    let {
      reqMethod
    } = methods

    this.log('addRouteMws', {
      methods,
      routeMws,
      route,
      router,
      reqMethod
    })

    let restVerb = router[reqMethod]

    if (!restVerb) {
      this.error('no such reqMethod for router', {
        router,
        reqMethod
      })
    }

    // As per: https://github.com/alexmingoia/koa-router#multiple-middleware
    restVerb.call(restVerb, route, ...routeMws);
    this.log('added route with middleware', {
      restVerb,
      route,
      restVerb
    })
    return this
  }
}
