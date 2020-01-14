const MongoRepository = require("../MongoRepository.js");

module.exports = class GuildRepository extends MongoRepository {
  constructor(mongoose, model, style) {
    super(mongoose, mongoose.model(style, model))
  }

  parse(entity) {
    return {
      prefix: process.env.PREFIX,
      language: 'pt-BR',
      modules: new Map(),
      ...(super.parse(entity) || {})
    }
  }

  getParse() {
    return {}
  }
}