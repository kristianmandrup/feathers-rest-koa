// TODO: use koa-routes
import Router from 'koa-router';
import {
  BaseRoutes
} from '../base/routes'
import {
  createRest
} from './rest'

const RESTmethods = {
  get: 'find',
  post: 'create',
  patch: 'patch',
  put: 'update',
  delete: 'remove'
};

export function createRoutes(app, opts = {}) {
  return new KoaRoutes(app, opts);
}

export class KoaRoutes extends BaseRoutes {
  constructor(app, opts = {}) {
    super(app, opts)
  }

  get label() {
    return 'KoaRoutes'
  }

  get providerName() {
    return 'koa'
  }

  createRouter() {
    return new Router()
  }

  createRest(path) {
    super.createRest(path)

    this.log('createRest', {
      path
    })
    return createRest(this.app, this.config, this.opts).configure()
  }

  postConfig() {
    let {
      app,
      router
    } = this;

    app
      .use(router.routes())
      .use(router.allowedMethods());

    return this;
  }
}
