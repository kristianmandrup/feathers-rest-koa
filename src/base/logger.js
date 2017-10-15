export class Logger {
  constructor(opts = {}) {
    this.opts = opts
    this.logging = opts.logging;
    process.env.DEBUG = process.env.DEBUG || opts.debug
  }

  get label() {
    throw new Error('Logger: subclass must implement the label')
  }

  log(...msgs) {
    if (!this.logging) return;
    console.log(this.label, ...msgs);
  }

  warn(...msgs) {
    this.log('WARNING', ...msgs)
  }

  notImplemented(method) {
    this.error(`${method} not implemented`)
  }

  error(msg, obj) {
    console.error(`${this.label} ${msg}`, obj)
    throw new Error(`${this.label} ${msg}`)
  }
}
