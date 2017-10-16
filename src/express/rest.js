import {
  BaseRest
} from '../base/rest'
import {
  createRoute
} from './route'

export function createRest(app, config, opts) {
  return new ExpressRest(app, config, opts)
}

export class ExpressRest extends BaseRest {
  constructor(app, config, opts = {}) {
    super(app, config, opts)
    let name = opts.name
    this.name = name
    this.route = config.appRoutes[name]
  }

  get label() {
    return 'ExpressRest'
  }

  createRoute(route, methods) {
    this.log('createRoute', {
      route,
      methods
    })
    return createRoute(this, route, methods, this.opts).configure()
  }
}
