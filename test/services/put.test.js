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
  describe('CRUD: put', function () {
    let config = configure.bind(this);
    config();

    describe('Services', () => {
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
            let data = JSON.parse(body);
            verify.update(null, original, data);

            done(error);
          });
      });
    });
  });
});
