const { Module } = require("../");
const Joi = require("@hapi/joi");

module.exports = class LanguageModule extends Module {
  constructor(client) {
    super('language', client)
    this.displayName = 'Language'

    this.toggleable = false
    this.defaultValues = { language: 'pt-BR' }

    this.specialInput = {
      language: {
        whitelist: this.client.language && this.client.language.langs.map(a => a.type)
      }
    }
  }

  validateValues(entity) {
    return Joi.object().keys({
      language: Joi.string().valid(...this.client.language.langs.map(a => a.type))
    }).validate(entity)
  }
}