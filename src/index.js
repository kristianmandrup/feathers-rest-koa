import wrappers from './wrappers';
import {
  config as defaultConfig
} from './express'

const log = console.log

export default function rest(opts = {}) {
  opts = opts || {}
  log('rest', {
    opts,
    defaultConfig
  })
  return function () {
    const app = this;
    app.rest = wrappers;

    let config = opts.config || defaultConfig
    config(app, opts)
  };
}
