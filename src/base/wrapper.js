// TODO: add base wrapper code here that is not framework dependent

export function wrapper(method, getArgs, service, {
  ctx,
  req,
  res,
  next,
  opts
}) {
  let createSetter = opts.createSetter || defaultCreateSetter
  let setter = createSetter(ctx)

  setter.setHeader('Allow', allowedMethods(service).join(','));

  // Check if the method exists on the service at all. Send 405 (Method not allowed) if not
  if (typeof service[method] !== 'function') {
    debug(`Method '${method}' not allowed on '${req.url}'`);
    res.code = statusCodes.methodNotAllowed;
    return next(new errors.MethodNotAllowed(`Method \`${method}\` is not supported by this endpoint.`));
  }

  let params = Object.assign({}, req.params || {});
  delete params.__feathersId;

  // Grab the service parameters. Use req.feathers and set the query to req.query
  params = Object.assign({
    query: req.query || {}
  }, params, req.feathers);

  // Run the getArgs callback, if available, for additional parameters
  const args = getArgs(req, res, next);

  // The service success callback which sets res.data or calls next() with the error
  const callback = function (error, data) {
    const hookArgs = args.concat([params, callback]);

    if (error) {
      debug(`Error in REST handler: \`${error.message || error}\``);
      res.hook = hookObject(method, 'error', hookArgs);
      return next(error);
    }

    res.data = data;
    res.hook = hookObject(method, 'after', hookArgs);

    if (!data) {
      debug(`No content returned for '${req.url}'`);
      setter.setCode(statusCodes.noContent);
    } else if (method === 'create') {
      setter.setCode(statusCodes.created);
    }

    return next();
  };

  debug(`REST handler calling \`${method}\` from \`${req.url}\``);
  service[method].apply(service, args.concat([params, callback]));
};
