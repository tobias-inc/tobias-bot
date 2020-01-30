const { Command, ClientEmbed, Constants } = require("../../../");

module.exports = class CommandChannelRemove extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'remove',
      category: 'configuration',
      referenceCommand: 'commandchannel',
      aliases: ['unset'],
      utils: {
        parameters: [{
          type: 'channel',
          acceptText: true,
          missingError: 'errors:missingChannel'
        }]
      }
    })
  }

  async run({ t, author, channel, guild }, { id }) {
    const embed = new ClientEmbed(author)
    try {
      const guildDatabase = this.client.database.guilds
      const commandModule = this.client.modules.commands

      const { commandsChannel } = await guildDatabase.findOne(guild.id, 'commandsChannel')
      const hasChannel = commandsChannel.some(c => c.channelId === id)

      if (hasChannel) {
        await commandModule.removeCommandChannel(guild.id, id)
        embed.setTitle(t(`commands:${this.tPath}.removeChannelSuccessfully`))
      } else {
        embed.setColor(Constants.ERROR_COLOR).setTitle(t(`commands:${this.tPath}.channelInvalid`))
      }
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR).setTitle(t('errors:generic'))
    }

    channel.send(embed)
  }
}