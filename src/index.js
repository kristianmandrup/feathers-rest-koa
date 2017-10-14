import wrappers from './wrappers';
import {
  defaults as _defaults
} from './koa'

export default function rest(opts = {}) {
  return function () {
    const defaults = opts.defaults || _defaults || {}
    const app = this;
    app.rest = wrappers;

    let configJson = opts.configJson || defaults.configJson
    configJson(app, opts)

    let configProvider = opts.configProvider || defaults.configProvider
    configProvider(app, opts)

    let configRest = opts.configRest || defaults.configRest;
    configRest(app, opts);
  };
}
