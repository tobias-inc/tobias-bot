const { Command, ClientEmbed, CommandError } = require("../../");

module.exports = class FavColor extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'favcolor',
      category: 'social',
      aliases: ['setcolor'],
      aliases: [],
      utils: {
        requirements: { databaseOnly: true },
        parameters: [{ type: 'color', full: true, missingError: 'errors:invalidColor' }]
      }
    })
  }

  async run({ t, author, channel }, color) {
    const hexadecimal = color.rgb(true);

    try {
      const embed = new ClientEmbed(author);
      await this.client.controllers.social.setFavoriteColor(author.id, hexadecimal);
      channel.send(embed
        .setColor(hexadecimal)
        .setTitle(t('commands:favcolor.changedSuccessfully', { hexadecimal }))
      )
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }
  }
}
