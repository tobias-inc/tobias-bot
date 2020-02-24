const {
  Discord = require('discord.js'),
  Attachment = Discord.Attachment,
  Command, ClientEmbed, Constants
} = require('../..')

module.exports = class AddEmoji extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'addemoji',
      category: 'utility',
      aliases: ['adicionaremoji']
    })
  }

  run ({ channel, guild, args, author, message }, t) {
    const embed = new ClientEmbed(author, { author: [this.client.user] })

    if (!args) {
      return embed
        .setDescription(`**${author.username}** ${t('comandos:emojiinfo.noArgs')}`)
        .setColor(Constants.ERROR_COLOR)
    }

    const emojo = message.attachments.first().url

    if (!emojo) {
      return embed
        .setDescription(`**${author.username}** ${t('comandos:emojiinfo.noEmoji', { searsh: args[0] })}`)
        .setColor(Constants.ERROR_COLOR)
    }

    guild.createEmoji(emojo, args[0])
    const type = emojo.animated ? '.gif' : '.png'
    const emoji = new Attachment(emojo.url, emojo.name + type)
    channel.send(`\`${emojo.name}\``, emoji || embed)
  }
}
