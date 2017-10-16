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

import {
  config
} from '../../src/express'

const log = console.log

let req
describe('REST provider', function () {
  describe('CRUD: get', function () {
    before(done => {
      console.log('before: config request')
      let configured = configure.bind(this)({
        config,
        logging: true
      })
      req = configured.req
    })

    describe('Services', () => {
      it.only('GET .find', done => {
        req
          .get('/todo')
          .expect(200)
          .end((error, response) => {
            // if (error) assert.fail(error.message);
            log({
              body: response.body
            })

            verify.find(JSON.parse(response.body));
            done(error);
          });
      });

      it('GET .get', done => {
        req
          .get('/todo/dishes')
          .expect(200)
          .end((error, response, body) => {
            verify.get('dishes', JSON.parse(body));
            done(error);
          });
      });
    });
  });
});
