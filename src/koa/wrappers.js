import {
  wrapper
} from '../base/wrapper'

// create and return object with operations to work on ctx or response
export function defaultCreateSetter(ctx) {
  let _ctx = ctx
  return {
    setStatus: (code) => {
      _ctx.code = code
    },
    setHeader: (name, value) => {
      _ctx.set(name, value)
    }
  }
}

export function createWrapper(method, getArgs, opts) {
  return service => {
    return async function (ctx, next) {
      return wrapper(method, getArgs, service, {
        ctx: res,
        req,
        res,
        next,
        opts
      })
    }
  }
}
