import makeDebug from 'debug';
const debug = makeDebug('feathers:rest');
import {
  BaseRoutes
} from '../base/routes'
import {
  createRest
} from './rest'

export function createRoutes(app, opts = {}) {
  return new Routes(app, opts);
}

// FIX: Use Express router
export class ExpressRoutes extends BaseRoutes {
  constructor(app, opts = {}) {
    super(app, opts)
  }

  get label() {
    return 'ExpressRoutes'
  }

  // TODO: create Express router
  createRouter() {
    // this.notImplemented('createRouter')
  }

  get providerName() {
    return 'express'
  }

  createRest(path) {
    this.log('createRest', {
      path,
      // ctx: this
    })
    return createRest(this.app, path, this.config, this.opts)
  }
}
