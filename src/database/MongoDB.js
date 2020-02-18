const mongoose = require('mongoose')

const schemas = call =>
  require('../').FileUtils.requireDirectory('src/database/schemas', call)

module.exports = class MongoDB {
  constructor (options = {}) {
    this.options = options
    this.mongoose = mongoose
  }

  async connect () {
    return mongoose
      .connect(process.env.MONGODB_URI, this.options)
      .then(() => this.loadSchemas())
  }

  loadSchemas () {
    return schemas(
      ({ required: { name, style, model, repositorie: Repositorie } }) => {
        this[name] = new Repositorie(mongoose, model, style)
      }
    )
  }
}
