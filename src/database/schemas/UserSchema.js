const { Schema } = require("mongoose");

const Constants = require("../../utils/Constants.js");

const vipTypes = ['dbl', 'bpd'];

const BlacklistedSchema = new Schema({
  reason: String,
  blacklister: { type: String, required: true }
})

const VipSchema = new Schema({
  type: { type: String, required: true },
  date: { type: Number, default: Date.now() }
})

const LevelSchema = new Schema({
  level: { type: Number, required: true },
  maxXp: { type: Number, required: true }
})

const BadgeSchema = new Schema({
  role: { type: String, required: true },
  source: { type: String, required: true }
})

const EconomySchema = new Schema({
  by: { type: Date, required: true },
  lastDaily: { type: Number, default: 0 },
  lastRep: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  rep: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  pocket: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  levels: [LevelSchema],
  favColor: { type: String, default: Constants.FAV_COLOR },
  personalText: { type: String, default: 'Nothing inserted...' },
  background: { type: String, default: Constants.DEFAULT_BACKGROUND },
  badges: [BadgeSchema]
})

const PremiumSchema = new Schema({
  activeAt: { type: Date, default: Date.now() },
  removeAt: { type: Date, required: true }
})

const UserSchema = new Schema({
  _id: String,
  blacklisted: BlacklistedSchema,
  economy: EconomySchema,
  premium: PremiumSchema,
  vip: [VipSchema],
})

module.exports = {
  name: 'users',
  style: 'Users',
  repositorie: require("../repositories/UserRepository.js"),
  model: UserSchema
}

VipSchema.pre('save', function (next) {
  if (!vipTypes
    .some(type => type.toLowerCase() === this.type)
  ) throw new Error('The type you entered is not valid');

  this.type = this.type.toUpperCase()
  return next()
})