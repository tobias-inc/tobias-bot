const { Schema } = require("mongoose");

const ModuleSchema = new Schema({
  active: { type: Boolean, required: true },
  values: {}
})

const CommandsChannelSchema = new Schema({
  channelID: { type: String, required: true }
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
    modules: {
      type: Map,
      of: ModuleSchema
    }
  })
}