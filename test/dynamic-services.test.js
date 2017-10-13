import {
  // close,
  configure,
  assert,
  request,
  // feathers,
  // bodyParser,
  // rest,
  // todoService,
  verify
} from './config';

describe('REST provider: dynamic services', function () {
  describe('CRUD', function () {
    configure.bind(this)();

    describe('Dynamic Services', () => {
      it('GET .find', done => {
        request
          .get('http://localhost:4777/tasks')
          .expect(200)
          .end((error, response, body) => {
            verify.find(JSON.parse(body));
            done(error);
          });
      });

      it('GET .get', done => {
        request
          .get('http://localhost:4777/tasks/dishes')
          .expect(200)
          .end((error, response) => {
            verify.get('dishes', JSON.parse(response.body));
            done(error);
          });
      });

      it('POST .create', done => {
        let original = {
          description: 'Dynamic POST .create'
        };

        request
          .post('http://localhost:4777/tasks')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(201)
          .end((error, response) => {
            verify.create(original, JSON.parse(response.body));
            done(error);
          });
      });

      it('PUT .update', done => {
        let original = {
          description: 'Dynamic PUT .update'
        };

        request
          .put('http://localhost:4777/tasks/544')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response) => {
            verify.update(544, original, JSON.parse(response.body));
            done(error);
          });
      });

      it('PATCH .patch', done => {
        let original = {
          description: 'Dynamic PATCH .patch'
        };

        request
          .patch('http://localhost:4777/tasks/544')
          .send(JSON.stringify(original))
          .set('Content-Type', 'application/json')
          .expect(200)
          .end((error, response) => {
            verify.patch(544, original, JSON.parse(response.body));
            done(error);
          });
      });

      it('DELETE .remove', done => {
        request
          .delete('http://localhost:4777/tasks/233')
          .end((error, response, body) => {
            assert.ok(response.statusCode === 200, 'Got OK status code');
            verify.remove(233, JSON.parse(body));
            done(error);
          });
      });
    });
  });
});
