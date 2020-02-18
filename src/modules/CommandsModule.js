const Joi = require('@hapi/joi')
const { Module } = require('../')

const CHANNEL_ID_LENGTH = 18

module.exports = class CommandModule extends Module {
  constructor (client) {
    super('commands', client)
    this.displayName = 'Commands'

    this.defaultValues = { commandsChannel: [] }
  }

  async retrieveValue (_guild, value) {
    if (!this.client.database) return this.defaultValues[value]
    return this._guilds.findOne(_guild, value).then(g => g[value])
  }

  async removeCommandChannel (_guild, _channel) {
    const { error, value: channelId } = this.validateValues(
      'commandsChannel',
      _channel
    )
    if (error) throw error

    return this._guilds.update(_guild, {
      $pull: { commandsChannel: { channelId } }
    })
  }

  async setCommandChannel (_guild, _channel) {
    const { error, value: channelId } = this.validateValues(
      'commandsChannel',
      _channel
    )
    if (error) throw error

    const { commandsChannel } = await this._guilds.findOne(
      _guild,
      'commandsChannel'
    )
    const hasChannel = commandsChannel.some(c => c.channelId === channelId)

    if (hasChannel) return
    return this._guilds.update(_guild, {
      $push: { commandsChannel: { channelId } }
    })
  }

  validateValues (type, entity) {
    switch (type) {
      case 'commandsChannel':
        return Joi.string()
          .min(CHANNEL_ID_LENGTH)
          .max(CHANNEL_ID_LENGTH)
          .trim()
          .truncate()
          .validate(entity)
      default:
        return { value: entity }
    }
  }
}
