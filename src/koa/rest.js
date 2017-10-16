import {
  BaseRest
} from '../base/rest'
import {
  createRoute
} from './route'

export function createRest(app, config, opts) {
  return new KoaRest(app, config, opts)
}

export class KoaRest extends BaseRest {
  constructor(app, config, opts = {}) {
    super(app, config, opts)
  }

  get label() {
    return 'KoaRest'
  }

  createRoute(route, methods) {
    console.log('createRoute', {
      route,
      methods
    })
    return createRoute(this, route, methods, this.opts).configure()
  }
}
