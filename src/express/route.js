import {
  BaseRoute
} from '../base/route'

export function createRoute(app, path, config, opts) {
  return new Route(app, path, config, opts)
}

export class Route extends BaseRoute {
  constructor(app, path, config, opts = {}) {
    super(opts)
  }

  addRouteMws(route, routeMws, methods) {
    let verb = route[methods.http]
    verb.apply(verb, routeMws);
  }

  postConfig(route, methods) {
    this.log('postConfig: not implemented yet')
  }
}
