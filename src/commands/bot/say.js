const { Command } = require('../../')
const { Util } = require('discord.js')

module.exports = class Say extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'say',
      category: 'bot',
      utils: {
        requirements: { guildOnly: true, permissions: ['MANAGE_GUILD'] },
        parameters: [
          { type: 'string', full: true, missingError: 'errors:invalidString' }
        ]
      }
    })
  }

  run ({ channel }, expr) {
    return channel.send(Util.removeMentions(expr))
  }
}
