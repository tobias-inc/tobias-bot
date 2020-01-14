const { Schema } = require("mongoose");

const vipTypes = ['dbl', 'bpd'];

const BlacklistedSchema = new Schema({
  reason: String,
  blacklister: { type: String, required: true }
})

const EconomySchema = new Schema({
  by: {
    type: Date,
    required: true
  },
  lastDaily: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  pocket: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  favColor: { type: String, default: process.env.FAV_COLOR },
  personalText: { type: String, default: 'Nothing inserted...' }
})

const VipSchema = new Schema({
  type: { type: String, required: true },
  date: { type: Number, default: Date.now() }
})

VipSchema.pre('save', function (next) {
  if (!vipTypes
    .some(type => type.toLowerCase() === this.type)
  ) throw new Error('The type you entered is not valid');

  this.type = this.type.toUpperCase()
  return next()
})

module.exports = {
  name: 'users',
  style: 'Users',
  repositorie: require("../repositories/UserRepository.js"),
  model: new Schema({
    _id: String,
    blacklisted: BlacklistedSchema,
    economy: EconomySchema,
    vip: [VipSchema],
  })
}