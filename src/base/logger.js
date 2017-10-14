export class Logger {
  constructor(app, opts = {}) {
    this.opts = opts
    this.logging = opts.logging;
  }

  get label() {
    throw new Error('Logger: subclass must implement the label')
  }

  log(...msgs) {
    if (!this.logging) return;
    console.log(this.label, ...msgs);
  }

  notImplemented(method) {
    this.error(`${method} not implemented`)
  }

  error(msg, obj) {
    console.error(`${this.label} #{msg}`, obj)
    throw new Error(`${this.label} #{msg}`)
  }
}
