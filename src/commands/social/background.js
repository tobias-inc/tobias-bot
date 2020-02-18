const { Command, ClientEmbed, Constants } = require('../../')

module.exports = class Background extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'background',
      category: 'social',
      utils: {
        requirements: { databaseOnly: true, apis: ['imgur'] },
        parameters: [{ type: 'image', missingError: 'errors:invalidImage' }]
      }
    })
  }

  async run ({ t, author, channel }, image) {
    const embed = new ClientEmbed(author)

    try {
      const {
        image: thumbnail
      } = await this.client.controllers.social.setBackground(author.id, image)
      embed.setTitle(t('commands:background.updateBackgroundSucess'))
      embed.setThumbnail(thumbnail)
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'URL_INVALID':
          embed.setTitle(t('commands:background.updateBackgroundError'))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed)
  }
}
