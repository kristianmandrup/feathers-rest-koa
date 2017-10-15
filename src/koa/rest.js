import {
  BaseRest
} from '../base/rest'
import {
  createRoute
} from './route'

export function createRest(app, path, config, opts) {
  return new KoaRest(app, path, config, opts)
}

export class KoaRest extends BaseRest {
  constructor(app, path, config, opts = {}) {
    super(app, path, config, opts)
  }

  get label() {
    return 'KoaRest'
  }

  createRoute(rest, route, methods, opts) {
    return createRoute(this, route, methods, this.opts)
  }
}
