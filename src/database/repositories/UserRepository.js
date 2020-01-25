const MongoRepository = require("../MongoRepository.js");
const Constants = require("../../utils/Constants.js");
const Utils = require("../../utils");

module.exports = class UserRepository extends MongoRepository {
  constructor(mongoose, model, style) {
    super(mongoose, mongoose.model(style, model))
  }

  parse(entity) {
    return {
      blacklisted: false,
      economy: {
        lastDaily: 0,
        lastRep: 0,
        xp: 0,
        rep: 0,
        bank: 0,
        pocket: 0,
        level: 1,
        levels: [{ level: 1, maxXp: Utils.XPtoNextLevel(1) }],
        favColor: Constants.FAV_COLOR,
        personalText: Constants.DEFAULT_PERSONAL_TEXT,
        background: Constants.DEFAULT_BACKGROUND,
        badges: []
      },
      vip: [],
      ...(super.parse(entity) || {})
    }
  }

  getParse() {
    return {
      economy: {
        by: Date.now(),
        levels: [{ level: 1, maxXp: Utils.XPtoNextLevel(1) }]
      }
    }
  }
}