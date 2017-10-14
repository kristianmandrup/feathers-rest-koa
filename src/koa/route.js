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
}
