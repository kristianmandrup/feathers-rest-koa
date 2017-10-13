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

let req
describe('REST provider', function () {
  describe('CRUD: get', function () {
    before(done => {
      let config = configure.bind(this)()
      req = config.req
    })

    describe('Services', () => {
      it.only('GET .find', done => {
        req
          .get('/todo')
          .expect(200)
          .end((error, response, body) => {
            if (error) assert.fail(error.message);
            verify.find(JSON.parse(body));
            done(error);
          });
      });

      // it('GET .get', done => {
      //   req
      //     .get('/todo/dishes')
      //     .expect(200)
      //     .end((error, response, body) => {
      //       verify.get('dishes', JSON.parse(body));
      //       done(error);
      //     });
      // });
    });
  });
});
