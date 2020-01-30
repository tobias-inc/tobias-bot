const Joi = require("@hapi/joi");
const { Module } = require("../");

const CHANNEL_ID_LENGTH = 18

module.exports = class CommandModule extends Module {
  constructor(client) {
    super('command', client)
    this.displayName = 'Command'

    this.toggleable = false
    this.defaultValues = { commandsChannel: {} }
  }

  async removeCommandChannel(_guild, _channel) {
    const { error, value } = this.validateValues('commandsChannel', _channel)
    if (error) throw error

    const values = await this.retrieveValue(_guild, 'commandsChannel')
    const valuesOff = Object.keys(values).filter(c => c !== value).map(c => ([c, true]))

    let obj = {}
    valuesOff.forEach(([k, v]) => obj[k] = v)
    const entity = { commandsChannel: { ...obj } }
    return this.updateValues(_guild, entity, { validate: false })
  }

  async setCommandChannel(_guild, _channel) {
    const { error, value } = this.validateValues('commandsChannel', _channel)
    if (error) throw error

    const values = await this.retrieveValue(_guild, 'commandsChannel')
    const hasChannel = values[value]

    if (hasChannel) return
    const entity = { commandsChannel: { [value]: true, ...values } }
    return this.updateValues(_guild, entity, { validate: false })
  }

  validateValues(type, entity) {
    switch (type) {
      case 'commandsChannel':
        return Joi.string().min(CHANNEL_ID_LENGTH).max(CHANNEL_ID_LENGTH).trim().truncate().validate(entity)
      default:
        return { value: entity }
    }
  }
}