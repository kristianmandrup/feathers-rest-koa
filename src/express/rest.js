import {
  BaseRest
} from '../base/rest'
import {
  createRoute
} from './route'

export function createRest(app, path, config, opts) {
  return new ExpressRest(app, path, config, opts)
}

export class ExpressRest extends BaseRest {
  constructor(app, path, config, opts = {}) {
    super(opts)
    this.createRoute = opts.createRoute || createRoute || this.createRoute
    this.createRoute.bind(this)
  }

  get label() {
    return 'ExpressRest'
  }

  createRoute(route, methods) {
    return createRoute(this, route, methods, this.opts)
  }
}
