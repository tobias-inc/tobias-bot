module.exports = class Repository {
  constructor() {
    if (this.constructor === Repository) throw new Error('Cannot instantiate abstract class')
  }

  parse() { }

  add() { }

  get() { }

  remove() { }

  findOne() { }

  findAll() { }

  update() { }
}