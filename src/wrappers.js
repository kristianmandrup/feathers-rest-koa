import makeDebug from 'debug';
import errors from 'feathers-errors';
import {
  hooks
} from 'feathers-commons';

const debug = makeDebug('feathers:rest');
const hookObject = hooks.hookObject;
const statusCodes = {
  created: 201,
  noContent: 204,
  methodNotAllowed: 405
};
const methodMap = {
  find: 'GET',
  get: 'GET',
  create: 'POST',
  update: 'PUT',
  patch: 'PATCH',
  remove: 'DELETE'
};
const allowedMethods = function (service) {
  return Object.keys(methodMap)
    .filter(method => typeof service[method] === 'function')
    .map(method => methodMap[method])
    // Filter out duplicates
    .filter((value, index, list) => list.indexOf(value) === index);
};

import {
  createWrapper
} from './koa'

// A function that returns the middleware for a given method and service
// `getArgs` is a function that should return additional leading service arguments
function getHandler(method, getArgs, opts = {}) {
  return createWrapper(method, getArgs, opts)
}

// Returns no leading parameters
function reqNone() {
  return [];
}

// Returns the leading parameters for a `get` or `remove` request (the id)
function reqId(req) {
  return [req.params.__feathersId || null];
}

// Returns the leading parameters for an `update` or `patch` request (id, data)
function reqUpdate(req) {
  return [req.params.__feathersId || null, req.body];
}

// Returns the leading parameters for a `create` request (data)
function reqCreate(req) {
  return [req.body];
}

// Returns wrapped middleware for a service method.
// Doing some fancy ES 5 .bind argument currying for .getHandler()
// Basically what you are getting for each is a function(service) {}
export default {
  find: getHandler.bind(null, 'find', reqNone),
  get: getHandler.bind(null, 'get', reqId),
  create: getHandler.bind(null, 'create', reqCreate),
  update: getHandler.bind(null, 'update', reqUpdate),
  patch: getHandler.bind(null, 'patch', reqUpdate),
  remove: getHandler.bind(null, 'remove', reqId)
};
