import {
  configure,
  // assert,
  request,
  // feathers,
  // bodyParser,
  // rest,
  // todoService,
  verify
} from '../config';

describe('REST provider', function () {
  describe('CRUD: patch', function () {
    let config = configure.bind(this);
    config();

    describe('Services', () => {
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
            verify.patch(null, original, JSON.parse(response.body));
            done(error);
          });
      });
    });
  });
});
