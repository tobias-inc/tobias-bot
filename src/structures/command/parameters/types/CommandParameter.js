const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const regexpSpecialChars = /([[\]^$|()\\+*?{}=!.])/gi

const quoteRegex = text => text.replace(regexpSpecialChars, '\\$1')
const prefixRegex = prefix => new RegExp(`^${quoteRegex(prefix)}`)

const filter = n => c =>
  c.name === n.toLowerCase() || c.aliases.includes(n.toLowerCase())

module.exports = class CommandParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      full: true,
      validCommands: !!options.validCommands,
      getSubcommands: !!options.getSubcommands
    }
  }

  static parse (arg, { t, client, prefix }) {
    if (!arg) return
    arg = arg.replace(prefixRegex(prefix), '')

    const [cmd, subcmd] = arg.split(/ +/g)
    const command = client.commands
      .filter(c => this.validCommands && !c.hidden)
      .find(filter(cmd))

    if (!command) throw new CommandError(t('errors:invalidCommand'))
    if (this.getSubcommands && subcmd) {
      const subcommand = command.subcommands.find(filter(subcmd))
      if (subcommand) return subcommand
    }

    return command
  }
}
