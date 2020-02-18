module.exports = class Repository {
  constructor () {
    if (this.constructor === Repository) { throw new Error('Cannot instantiate abstract class') }
  }

  getParse () {
    return {}
  }

  parse () {}

  add () {}

  get () {}

  remove () {}

  findOne () {}

  findAll () {}

  update () {}
}
