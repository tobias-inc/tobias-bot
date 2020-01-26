const { Command, ClientEmbed, Constants } = require("../../../");

module.exports = class BackgroundRemove extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'remove',
      category: 'social',
      aliases: ['reset', 'resetar'],
      referenceCommand: 'background'
    })
  }

  async run({ t, author, channel }) {
    await this.client.database.users.update(author.id, { 'economy.background': Constants.DEFAULT_BACKGROUND })
    channel.send(new ClientEmbed(author)
      .setTitle(t(`commands:${this.tPath}.backgroundReset`))
    )
  }
}