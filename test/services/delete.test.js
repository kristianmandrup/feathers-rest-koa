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
  describe('CRUD: delete', function () {
    let config = configure.bind(this);
    config();

    describe('Services', () => {
      it('DELETE .remove', done => {
        request
          .delete('http://localhost:4777/tasks/233')
          .expect(200)
          .end((error, response) => {
            verify.remove(233, JSON.parse(response.body));
            done(error);
          });
      });

      it('DELETE .remove many', done => {
        request
          .delete('http://localhost:4777/tasks')
          .expect(200)
          .end((error, response) => {
            verify.remove(null, JSON.parse(response.body));
            done(error);
          });
      });
    });
  });
});
