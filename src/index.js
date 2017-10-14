import wrappers from './wrappers';
import {
  config as defaultConfig
} from './koa'

const log = console.log

export default function rest(opts = {}) {
  return function () {
    const app = this;
    app.rest = wrappers;

    let config = opts.config || defaultConfig
    config(app, opts)
  };
}
