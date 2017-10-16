import makeDebug from 'debug';
const debug = makeDebug('feathers:rest');
import {
  BaseRoutes
} from '../base/routes'
import {
  createRest
} from './rest'

export function createRoutes(app, opts = {}) {
  return new ExpressRoutes(app, opts);
}

// FIX: Use Express router
export class ExpressRoutes extends BaseRoutes {
  constructor(app, opts = {}) {
    super(app, opts)
    this.appRoutes = {}
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

  configure() {
    super.configure()
    this.createAppRoutes()
    return this
  }

  createAppRoutes() {
    let {
      app,
      routeNames,
      routeMap
    } = this
    this.log('createAppRoutes', {
      routeNames,
      routeMap
    })
    routeNames.map(name => {
      let path = routeMap[name]
      this.addAppRoute(name, path)
    })
    return this
  }

  prepareConfig(options) {
    this.log('prepareConfig', {
      options
    })
    super.prepareConfig(options)
    this.config.appRoutes = this.appRoutes
  }

  addAppRoute(name, path) {
    this.appRoutes[name] = this.app.route(path)
  }

  createRest(path) {
    super.createRest(path)
    let name = this.invertedMap[path]
    let {
      opts
    } = this
    opts.name = name
    this.log('createRest', {
      path,
      name,
      opts
    })
    return createRest(this.app, this.config, opts).configure()
  }
}
