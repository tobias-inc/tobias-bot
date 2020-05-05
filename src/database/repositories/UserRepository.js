const MongoRepository = require('../MongoRepo.js')
const Constants = require('../../utils/Constants.js')
const Utils = require('../../utils')

module.exports = class UserRepository extends MongoRepository {
  constructor (mongoose, model, style) {
    super(mongoose, mongoose.model(style, model))
  }

  parse (entity) {
    return {
      blacklisted: false,
      economy: {
        lastDaily: 0,
        lastRep: 0,
        level: 1,
        xp: 0,
        rep: 0,
        bank: 0,
        pocket: 0,
        favColor: Constants.FAV_COLOR,
        personalText: Constants.DEFAULT_PERSONAL_TEXT,
        background: Constants.DEFAULT_BACKGROUND,
        guildExperience: [],
        levels: [{ level: 1, maxXp: Utils.XPtoNextLevel(1) }],
        badges: []
      },
      vip: [],
      ...(super.parse(entity) || {})
    }
  }

  getParse () {
    return {
      economy: {
        createdAt: Date.now(),
        levels: [{ level: 1, maxXp: Utils.XPtoNextLevel(1) }]
      }
    }
  }
}
