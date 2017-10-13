import {
  close,
  // configure,
  assert,
  request,
  feathers,
  // bodyParser,
  rest
  // todoService,
  // verify
} from './config';

describe('REST provider: status codes', function () {
  describe('CRUD', function () {
    describe('HTTP status codes', () => {
      let app;
      let server;

      before(function () {
        app = feathers().configure(rest())
          .use('todo', {
            get(id) {
              return Promise.resolve({
                description: `You have to do ${id}`
              });
            },

            patch() {
              return Promise.reject(new Error('Not implemented'));
            },

            find() {
              return Promise.resolve(null);
            }
          });

        app.use(function (ctx, next) {
          if (typeof ctx.body !== 'undefined') {
            next(new Error('Should never get here'));
          } else {
            next();
          }
        });

        // Error handler
        app.on('error', function (error, ctx) {
          console.log({
            error,
            ctx
          });
        });

        server = app.listen(4780);
      });

      after(done => close(server, done));

      it('throws a 405 for undefined service methods and sets Allow header (#99)', done => {
        request
          .get('http://localhost:4780/todo/dishes')
          .expect(200)
          .end((error, response) => {
            if (error) assert.fail(error.message);
            assert.deepEqual(JSON.parse(response.body), {
              description: 'You have to do dishes'
            }, 'Got expected object');

            request
              .post('http://localhost:4780/todo')
              .expect(405)
              .end((error, response) => {
                if (error) assert.fail(error.message);
                assert.equal(response.headers.allow, 'GET,PATCH');
                assert.deepEqual(JSON.parse(response.body), {
                  message: 'Method `create` is not supported by this endpoint.'
                }, 'Error serialized as expected');
                done();
              });
          });
      });

      it('throws a 404 for undefined route', done => {
        request
          .get('http://localhost:4780/todo/foo/bar')
          .expect(404)
          .end((error, response) => {
            done(error);
          });
      });

      it('empty response sets 204 status codes, does not run other middleware (#391)', done => {
        request
          .get('http://localhost:4780/todo')
          .expect(204)
          .end((error, response) => {
            if (error) assert.fail(error.message);
            done(error);
          });
      });
    });
  });
});
