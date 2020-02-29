const UserParameter = require('./UserParameter.js')

const regexpSpecialChars = /([[\]^$|()\\+*?{}=!.])/gi

const quoteRegex = text => text.replace(regexpSpecialChars, '\\$1')
const prefixRegex = prefix => new RegExp(`^${quoteRegex(prefix)}`)

module.exports = class CommandParameter extends UserParameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      full: true,
      validCommands: !!options.validCommands,
      getSubcommands: !!options.getSubcommands
    }
  }

  static parse (arg, { client, prefix }) {
    if (!arg) return

    arg = arg.replace(prefixRegex(prefix), '')
    const [cmd, subcmd] = arg.split(/ +/g)

    const command = client.commands
      .filter(c => this.validCommands && !c.hidden)
      .find(
        c =>
          c.name === cmd.toLowerCase() || c.aliases.includes(cmd.toLowerCase())
      )

    if (command) {
      if (this.getSubcommands && subcmd) {
        const subcommand = command.subcommands.find(
          s =>
            s.name === subcmd.toLowerCase() ||
            s.aliases.includes(subcmd.toLowerCase())
        )
        if (subcommand) return subcommand
      }

      return command
    }
  }
}
