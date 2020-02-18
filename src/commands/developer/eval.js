const { Command } = require('../../')
const util = require('util')

module.exports = class Eval extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'eval',
      category: 'developer',
      aliases: ['e'],
      hidden: true,
      utils: {
        requirements: { devOnly: true },
        parameters: [
          { type: 'string', full: true, missingError: 'errors:invalidString' }
        ]
      }
    })
  }

  async run ({ channel, t, args, guild, message, author }, expr) {
    try {
      const evaled = await eval(expr.replace(/(^`{3}(\w+)?|`{3}$)/g, ''))
      const cleanEvaled = this.clean(util.inspect(evaled, { depth: 0 }))
      await channel.send(cleanEvaled, { code: 'js' })
    } catch (err) {
      channel.send('`ERROR` ```xl\n' + this.clean(err) + '\n```')
    }
  }

  clean (text) {
    const blankSpace = String.fromCharCode(8203)
    return typeof text === 'string'
      ? text.replace(/`/g, '`' + blankSpace).replace(/@/g, '@' + blankSpace)
      : text
  }
}
