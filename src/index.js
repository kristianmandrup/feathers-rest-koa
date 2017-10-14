import wrappers from './wrappers';
import {
  config as defaultConfig
} from './koa'

export default function rest(opts = {}) {
  return function () {
    const defaults = opts.defaults || _defaults || {}
    const app = this;
    app.rest = wrappers;

    let config = opts.config || defaultConfig
    config(app, opts)
  };
}
