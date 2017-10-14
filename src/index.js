import wrappers from './wrappers';

import {
  defaultConfigJson,
  defaultConfigFeathersRest,
  defaultRegisterRest
} from './koa'

export default function rest(opts = {}) {
  return function () {
    const app = this;
    let configJson = opts.configJson || defaultConfigJson
    configJson(app, opts)

    let configFeathersRest = opts.configJson || defaultConfigFeathersRest
    configFeathersRest(app, opts)

    app.rest = wrappers;
    let registerRest = opts.registerRest || defaultRegisterRest;
    registerRest(app, opts);
  };
}
