export class Routes {
  constructor (app, opts = {}) {
    this.app = app;

    let {
      before,
      after,
      service
    } = opts;

    this.before = before;
    this.after = after;
    this.service = service;
  }

  set uri (_uri) {
    this._uri = _uri;
    this.configure(_uri);
  }

  configure (uri) {
    let { app } = this;
    this.baseRoute = app.route(uri);
    this.idRoute = app.route(`${uri}/:__feathersId`);
  }

  configBaseRoute () {
    let {
      app,
      baseRoute,
      before,
      after,
      service
    } = this;

    // GET / -> service.find(cb, params)
    baseRoute.get.apply(baseRoute, before.concat(app.rest.find(service), after));
    // POST / -> service.create(data, params, cb)
    baseRoute.post.apply(baseRoute, before.concat(app.rest.create(service), after));
    // PATCH / -> service.patch(null, data, params)
    baseRoute.patch.apply(baseRoute, before.concat(app.rest.patch(service), after));
    // PUT / -> service.update(null, data, params)
    baseRoute.put.apply(baseRoute, before.concat(app.rest.update(service), after));
    // DELETE / -> service.remove(null, params)
    baseRoute.delete.apply(baseRoute, before.concat(app.rest.remove(service), after));
  }

  configIdRoute () {
    let {
      app,
      idRoute,
      before,
      after,
      service
    } = this;

    // GET /:id -> service.get(id, params, cb)
    idRoute.get.apply(idRoute, before.concat(app.rest.get(service), after));
    // PUT /:id -> service.update(id, data, params, cb)
    idRoute.put.apply(idRoute, before.concat(app.rest.update(service), after));
    // PATCH /:id -> service.patch(id, data, params, callback)
    idRoute.patch.apply(idRoute, before.concat(app.rest.patch(service), after));
    // DELETE /:id -> service.remove(id, params, cb)
    idRoute.delete.apply(idRoute, before.concat(app.rest.remove(service), after));
  }
}
