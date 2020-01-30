const { Command, ClientEmbed, Constants } = require("../../../");

module.exports = class CommandChannelSet extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'set',
      category: 'configuration',
      referenceCommand: 'commandchannel',
      aliases: ['add'],
      utils: {
        parameters: [{
          type: 'channel',
          acceptText: true,
          missingError: 'errors:missingChannel'
        }]
      }
    })
  }

  async run({ t, author, channel, guild }, { id, name }) {
    const embed = new ClientEmbed(author)
    try {
      const commandModule = this.client.modules.commands
      await commandModule.setCommandChannel(guild.id, id)
      embed.setDescription(t(`commands:${this.tPath}.setChannelSuccessfully`, { name }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR).setDescription(t('errors:generic'))
    }
    channel.send(embed)
  }
}