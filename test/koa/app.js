const Koa = require('koa');
import bodyParser from 'koa-bodyparser';

const app = module.exports = new Koa();

app.use(async function (ctx) {
  ctx.body = 'Hello World';
});

if (!module.parent) app.listen(3000);
