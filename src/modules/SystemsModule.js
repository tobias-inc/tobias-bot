const Joi = require('@hapi/joi')
const { Module } = require('../')

const CHANNEL_ID_LENGTH = 18

module.exports = class CommandModule extends Module {
  constructor (client) {
    super('systems', client)
    this.displayName = 'Systems'

    this.defaultValues = {
      systemsConfigurable: [],
      systemsDisabled: []
    }
  }

  retrieveValue (_guild, value) {
    if (!this.client.database) return this.defaultValues[value]
    return this._guilds.findOne(_guild, value).then(g => g[value])
  }

  retrieveValues (_guild, values) {
    if (!this.client.database) return this.defaultValues
    return this._guilds.findOne(_guild, values.join(' ')).then(g => {
      const obj = {}
      values.forEach(v => (obj[v] = g[v]))
      return obj
    })
  }

  validateValues (entity) {
    return Joi.object()
      .keys({
        LEVEL_UP: Joi.object().keys({
          channelId: Joi.string()
            .min(CHANNEL_ID_LENGTH)
            .max(CHANNEL_ID_LENGTH)
            .trim()
            .truncate()
        })
      })
      .validate(entity)
  }
}
