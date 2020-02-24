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
          { type: 'image', missingError: 'errors:invalidImage' },
          {
            type: 'string',
            full: true,
            removeSpaces: true,
            maxLength: EMOJI_NAME_MAX_LENGTH,
            missingError: 'errors:invalidString'
          }
        ]
      }
    })
  }

  async run ({ channel, guild, author, t }, image, emojiName) {
    const embed = new ClientEmbed(author)
    await guild
      .createEmoji(image, emojiName)
      .then(({ name }) => {
        embed
          .setTitle(t('commands:addemoji.successfullyAdded', { name }))
          .setThumbnail(image)
      })
      .catch(err => {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:addemoji.createEmojiError'))
          .setDescription(`\`${err}\``)
      })
    channel.send(embed)
  }
}
