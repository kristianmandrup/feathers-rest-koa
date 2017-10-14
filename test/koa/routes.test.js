import {
  assert,
  configure,
  Routes,
  createRoutes
} from '../config';

describe('REST provider', function () {
  let config = configure.bind(this);
  let app = config();

  describe('Routes', function () {
    const routes = createRoutes(app, {
      logging: true
    })

    it('can set service uri and route paths for base and :id', done => {
      let serviceName = 'person'
      routes.uri = serviceName
      assert.equal(routes._uri, serviceName)
      assert.equal(routes.baseRoute, serviceName)
      assert.equal(routes.idRoute, `${serviceName}/:__feathersId`)
      done()
    });
  });
});
