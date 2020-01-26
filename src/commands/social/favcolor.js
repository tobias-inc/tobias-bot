const { Command, ClientEmbed, Constants } = require("../../");

module.exports = class FavColor extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'favcolor',
      category: 'social',
      aliases: ['setcolor'],
      utils: {
        requirements: { databaseOnly: true },
        parameters: [{ type: 'color', full: true, missingError: 'errors:invalidColor' }]
      }
    })
  }

  async run({ t, author, channel }, color) {
    const embed = new ClientEmbed(author);
    const hexadecimal = color.rgb(true);
    try {
      await this.client.controllers.social.setFavoriteColor(author.id, hexadecimal);
      embed.setColor(hexadecimal).setTitle(t('commands:favcolor.changedSuccessfully', { hexadecimal }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR).setTitle(t('errors:generic'))
    }
    channel.send(embed)
  }
}
