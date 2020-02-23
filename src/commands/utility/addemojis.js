const {
  Discord = require("discord.js"),
  Attachment = Discord.Attachment,
  Command, ClientEmbed, Constants
} = require('../..')


module.exports = class AddEmoji extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'addemoji',
      category: 'utility',
      aliases: ['adicionaremoji']
    })
  }

  async run({ channel, guild, args }, t) {

    const embed = new ClientEmbed(author, { author: [this.client.user] })

    if (!args) {
      return embed
        .setDescription(Emojis.Errado + "**" + author.username + "**" + t('comandos:emojiinfo.noArgs'))
        .setColor(Constants.ERROR_COLOR)

    }

    let emojo = false

    emojo = await this.GetEmoji(args[0], guild);

    if (!emojo) {
      return embed
        .setDescription(Emojis.Errado + "**" + author.username + "**" + t('comandos:emojiinfo.noEmoji', { searsh: args[0] }))
        .setColor(Constants.ERROR_COLOR)

    }
    let type = emojo.animated ? '.gif' : '.png'
    let emoji = new Attachment(emojo.url, emojo.name + type);
    channel.send(`\`${emojo.name}\``, emoji || embed)
  }
}
