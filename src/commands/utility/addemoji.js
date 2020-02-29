const { Command, ClientEmbed, Constants } = require('../..')

const EMOJI_NAME_MAX_LENGTH = 22

module.exports = class AddEmoji extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'addemoji',
      category: 'utility',
      aliases: ['adicionaremoji'],
      utils: {
        requirements: {
          guildOnly: true,
          permissions: ['MANAGE_GUILD']
        },
        parameters: [
          {
            type: 'string',
            full: false,
            maxLength: EMOJI_NAME_MAX_LENGTH,
            missingError: 'errors:invalidString'
          },
          {
            type: 'image',
            acceptBuffer: true,
            missingError: 'errors:invalidImage'
          }
        ]
      }
    })
  }

  async run ({ channel, guild, author, t }, emojiName, { buffer, url }) {
    const embed = new ClientEmbed(author)
    await guild
      .createEmoji(buffer, this.escapeTraced(emojiName))
      .then(({ name }) => {
        embed
          .setTitle(t('commands:addemoji.successfullyAdded', { name }))
          .setThumbnail(url)
      })
      .catch(err => {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:addemoji.createEmojiError'))
          .setDescription(`\`${err}\``)
      })
    channel.send(embed)
  }

  escapeTraced (str) {
    return str.replace(/-/g, '_')
  }
}
