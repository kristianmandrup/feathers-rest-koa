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
  describe('CRUD: get', function () {
    let config = configure.bind(this);
    config();

    describe('Services', () => {
      it.only('GET .find', done => {
        request
          .get('http://localhost:4777/todo')
          .expect(200)
          .end((error, response, body) => {
            verify.find(JSON.parse(body));
            done(error);
          });
      });

      it('GET .get', done => {
        request
          .get('http://localhost:4777/todo/dishes')
          .expect(200)
          .end((error, response, body) => {
            verify.get('dishes', JSON.parse(body));
            done(error);
          });
      });
    });
  });
});
