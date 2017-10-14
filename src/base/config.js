import makeDebug from 'debug';
import {
  createRoutes
} from './routes';

const debug = makeDebug('feathers-rest-koa');

import {
  Logger
} from '../base/logger'

export class BaseConfig extends Logger {
  constructor(app, opts = {}) {
    super(opts)
    this.app = app
    this.opts = opts
  }

  configJson() {
    this.notImplemented('configJson')
  }

  configProvider() {
    this.notImplemented('configProvider')
  }

  configRest() {
    this.notImplemented('configRest')
  }

  configure() {
    this
      .configJson()
      .configProvider()
      .configRest()
    return this.app
  }
}
