const Parameter = require('./Parameter.js')
const DiscordUtils = require('../../../../utils/DiscordUtils.js')
const CommandError = require('../../CommandError.js')

module.exports = class StringParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      removeSpaces: !!options.clean,
      clean: !!options.clean,
      maxLength: options.maxLength || 0,
      truncate: !!options.truncate
    }
  }

  static parse (arg, { t, message, command }) {
    arg = arg ? (typeof arg === 'string' ? arg : String(arg)) : undefined
    if (!arg) return

    const maxLength =
      (typeof this.maxLength === 'object'
        ? this.maxLength[command.name]
        : this.maxLength) || 0

    if (this.removeSpaces) arg = arg.replace(/ +/g, '')
    if (this.clean) arg = DiscordUtils.cleanContent(arg, message)

    if (maxLength > 0 && arg.length > maxLength) {
      if (!this.truncate) {
        throw new CommandError(
          t('errors:needSmallerString', { number: maxLength })
        )
      }
      arg = arg.substring(0, maxLength)
    }

    return arg
  }
}
