import wrappers from './wrappers';

export default function rest(opts = {}) {
  return function () {
    const defaults = opts.defaults || {}
    const app = this;
    app.rest = wrappers;

    let configJson = opts.configJson || defaults.configJson
    configJson(app, opts)

    let configFeathersRest = opts.configJson || defaults.configFeathersRest
    configFeathersRest(app, opts)

    let registerRest = opts.registerRest || defaults.RegisterRest;
    registerRest(app, opts);
  };
}
