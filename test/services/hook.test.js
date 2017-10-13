import {
  configure,
  assert,
  request,
  // feathers,
  // bodyParser,
  // rest,
  // todoService,
  verify
} from '../config';

describe('REST provider', function () {
  describe('CRUD: hook', function () {
    let config = configure.bind(this);
    let app = config();

    describe('Services', () => {
      it('sets the hook object in res.hook', done => {
        app.use('/hook', {
          get(id, params, callback) {
            callback(null, {
              description: `You have to do ${id}`
            });
          }
        }, function (ctx, next) {
          ctx.body.hook = ctx.hook;
          next();
        });

        request
          .get('http://localhost:4777/hook/dishes')
          .end((error, response) => {
            if (error) assert.fail(error.message);
            const hook = JSON.parse(response.body).hook;
            assert.deepEqual(hook, {
              id: 'dishes',
              params: {
                query: {},
                provider: 'rest'
              },
              method: 'get',
              type: 'after'
            });
            done();
          });
      });

      it('sets the hook object in res.hook on error', done => {
        app.use('/hook-error', {
          get() {
            return Promise.reject(new Error('I blew up'));
          }
        }, function (ctx, next) {
          ctx.status(500);
          ctx.json({
            hook: ctx.hook
          });
        });

        request
          .get('http://localhost:4777/hook-error/dishes')
          .end((error, response) => {
            if (error) assert.fail(error.message);
            const hook = JSON.parse(response.body).hook;
            assert.deepEqual(hook, {
              id: 'dishes',
              params: {
                query: {},
                provider: 'rest'
              },
              method: 'get',
              type: 'error'
            });
            done();
          });
      });

      it('GET .find', done => {
        request
          .get('http://localhost:4777/todo')
          .expect(200)
          .end((error, response, body) => {
            if (error) assert.fail(error.message);
            verify.find(JSON.parse(body));
            done(error);
          });
      });

      it('GET .get', done => {
        request
          .get('http://localhost:4777/todo/dishes')
          .expect(200)
          .end((error, response, body) => {
            if (error) assert.fail(error.message);
            verify.get('dishes', JSON.parse(body));
            done(error);
          });
      });

      it('POST .create', done => {
        let original = {
          description: 'POST .create'
        };

        request
          .post('http://localhost:4777/todo')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(201)
          .end((error, response, body) => {
            if (error) assert.fail(error.message);
            verify.create(original, JSON.parse(body));
            done(error);
          });
      });

      it('PUT .update', done => {
        let original = {
          description: 'PUT .update'
        };

        request
          .put('http://localhost:4777/todo/544')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response) => {
            if (error) assert.fail(error.message);
            verify.update(544, original, JSON.parse(response.body));
            done(error);
          });
      });

      it('PUT .update many', done => {
        let original = {
          description: 'PUT .update',
          many: true
        };

        request
          .put('http://localhost:4777/todo')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response, body) => {
            if (error) assert.fail(error.message);
            let data = JSON.parse(body);
            verify.update(null, original, data);

            done(error);
          });
      });

      it('PATCH .patch', done => {
        let original = {
          description: 'PATCH .patch'
        };

        request
          .patch('http://localhost:4777/todo/544')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response, body) => {
            if (error) assert.fail(error.message);
            verify.patch(544, original, JSON.parse(body));
            done(error);
          });
      });

      it('PATCH .patch many', done => {
        let original = {
          description: 'PATCH .patch',
          many: true
        };

        request
          .patch('http://localhost:4777/todo')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response) => {
            if (error) assert.fail(error.message);
            verify.patch(null, original, JSON.parse(response.body));
            done(error);
          });
      });

      it('DELETE .remove', done => {
        request
          .delete('http://localhost:4777/tasks/233')
          .expect(200)
          .end((error, response) => {
            if (error) assert.fail(error.message);
            verify.remove(233, JSON.parse(response.body));
            done(error);
          });
      });

      it('DELETE .remove many', done => {
        request
          .delete('http://localhost:4777/tasks')
          .expect(200)
          .end((error, response) => {
            if (error) assert.fail(error.message);
            verify.remove(null, JSON.parse(response.body));
            done(error);
          });
      });
    });
  });
});
