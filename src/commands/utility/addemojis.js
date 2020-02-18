const { Command } = require('../..')
// const { Attachment } = require('discord.js')

module.exports = class AddEmoji extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'addemoji',
      category: 'utility',
      aliases: ['adicionaremoji']
    })
  }

  async run ({ channel, guild, message, args }, t) {}
}
