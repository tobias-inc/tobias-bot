const { Command, ClientEmbed, Constants } = require("../../");

module.exports = class Background extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'background',
      category: 'social',
      aliases: [],
      utils: {
        requirements: { databaseOnly: true, apis: ['imgur'] },
        parameters: [{
          type: 'image',
          full: true,
          required: true,
          showUsage: false,
          missingError: 'errors:invalidImage'
        }]
      }
    })
  }

  async run({ t, author, channel }, insertedImage) {
    const embed = new ClientEmbed(author);

    try {
      const { image } = await this.client.controllers.social.setBackground(author.id, insertedImage);
      embed.setTitle(t('commands:background.updateBackgroundSucess'))
      embed.setThumbnail(image);
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR);
      switch (e.message) {
        case 'URL_INVALID':
          embed.setDescription(t('commands:background.updateBackgroundError'))
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed);
  }
}
