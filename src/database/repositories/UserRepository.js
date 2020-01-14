const MongoRepository = require("../MongoRepository.js");

module.exports = class UserRepository extends MongoRepository {
  constructor(mongoose, model, style) {
    super(mongoose, mongoose.model(style, model))
  }

  parse(entity) {
    return {
      blacklisted: false,
      economy: {},
      ...(super.parse(entity) || {})
    }
  }

  getParse() {
    return {
      economy: {
        by: Date.now()
      }
    }
  }
}