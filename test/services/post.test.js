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
  describe('CRUD: post', function () {
    let config = configure.bind(this);
    config();

    describe('Services', () => {
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
            verify.create(original, JSON.parse(body));
            done(error);
          });
      });
    });
  });
});
