const { Schema } = require("mongoose");

const ModuleSchema = new Schema({
  active: { type: Boolean, required: true },
  values: {}
})

const CommandsChannelSchema = new Schema({
  channel: { type: String, required: true }
})

const SystemsDisabledSchema = new Schema({
  name: { type: String, required: true }
})

module.exports = {
  name: 'guilds',
  style: 'Guild',
  repositorie: require("../repositories/GuildRepository.js"),
  model: new Schema({
    _id: String,
    prefix: String,
    language: String,
    commandsChannel: [CommandsChannelSchema],
    systemsDisabled: [SystemsDisabledSchema],
    modules: {
      type: Map,
      of: ModuleSchema
    }
  })
}