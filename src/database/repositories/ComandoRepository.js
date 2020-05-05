const MongoRepository = require('../MongoRepo')

module.exports = class ComandoRepository extends MongoRepository {
  constructor (mongoose, model, style) {
    super(mongoose, mongoose.model(style, model))
  }

  parse (entity) {
    return {
      maintence: false,
      usages: 0,
      ...(super.parse(entity) || {})
    }
  }
}
