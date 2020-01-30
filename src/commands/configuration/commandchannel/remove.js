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

  async run({ t, author, channel, guild }, insertedChannel) {
    const embed = new ClientEmbed(author)

    const commandModule = await this.client.modules.command
    const SettedChannels = await commandModule.retrieveValue(guild.id, 'commandsChannel')
    const hasChannel = Object.keys(SettedChannels).find(c => c === insertedChannel.id)

    try {
      if (hasChannel) {
        await commandModule.removeCommandChannel(guild.id, insertedChannel.id)
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