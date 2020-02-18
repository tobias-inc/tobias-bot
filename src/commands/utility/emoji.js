const {
  Command,
  Discord = require('discord.js'),
  Attachment = Discord.Attachment,
  ErrorCommand
} = require('../..')

module.exports = class AddEmoji extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'addemoji',
      category: 'utility',
      aliases: ['adicionaremoji']
    })
  }

  async run ({ channel, guild, message, args }, t) {
    const a =
      Discord.Util.parseEmoji(args[0]) ||
      message.guild.emojis.find(emoji => emoji.name === args.join(' '))
    const emojo = await this.client.guilds.get(guild).emojis.get(a.id)

    try {
      const type = emojo.animated ? '.gif' : '.png'
      const emoji = new Attachment(emojo.url, emojo.name + type)
      channel.send(`\`${emojo.name}\``, emoji)
    } catch (err) {
      throw new ErrorCommand(err)
    }
  }
}
