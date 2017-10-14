import koaify from 'feathers-koa'

export default function ify(app) {
  // TODO: wrap app for use with latest Koa
  return koaify(app)
}
