const MongoRepository = require('../MongoRepository.js')
const Constants = require('../../utils/Constants.js')

module.exports = class GuildRepository extends MongoRepository {
  constructor (mongoose, model, style) {
    super(mongoose, mongoose.model(style, model))
  }

  parse (entity) {
    return {
      prefix: Constants.DEFAULT_PREFIX,
      language: Constants.DEFAULT_LANGUAGE,
      commandsChannel: [],
      systemsConfigurable: [],
      systemsDisabled: [],
      modules: new Map(),
      ...(super.parse(entity) || {})
    }
  }
}
