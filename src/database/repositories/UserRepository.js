const MongoRepository = require("../MongoRepository.js");
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
        xp: 0,
        rep: 0,
        bank: 0,
        pocket: 0,
        level: 1,
        levels: [{ level: 1, maxXp: Utils.XPtoNextLevel(1) }],
        favColor: process.env.FAV_COLOR,
        personalText: 'Nothing inserted...',
        background: 'src/assets/img/jpg/default-background.jpg'
      },
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