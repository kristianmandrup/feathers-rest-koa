import {
  wrapper
} from '../base/wrapper'

// create and return object with operations to work on ctx or response
export function defaultCreateSetter(ctx) {
  let _ctx = ctx
  return {
    setStatus: (code) => {
      _ctx.statusCode(code)
    },
    setHeader: (name, value) => {
      _ctx.setHeader(name, value)
    }
  }
}

// A function that returns the middleware for a given method and service
// `getArgs` is a function that should return additional leading service arguments
function createWrapper(method, getArgs, opts) {
  return service => {
    return function (req, res, next) {
      return wrapper(method, getArgs, service, {
        ctx: res,
        req,
        res,
        next,
        opts
      })
    };
  };
}
