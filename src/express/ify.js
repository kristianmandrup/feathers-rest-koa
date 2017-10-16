import expressify from 'feathers-express'

export default function ify(app) {
  // TODO: wrap app for use with latest Koa
  return expressify(app)
}
