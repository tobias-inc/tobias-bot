const MongoRepository = require('../MongoRepo')

module.exports = class ClientRepository extends MongoRepository {
  constructor (mongoose, model, style) {
    super(mongoose, mongoose.model(style, model))
  }

  parse (entity) {
    return {
      maintence: false,
      voteds: [],
      removeVotes: [],
      ...(super.parse(entity) || {})
    }
  }
}
