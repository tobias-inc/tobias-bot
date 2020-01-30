const { Command, ClientEmbed, Constants } = require("../../../");

module.exports = class CommandChannelList extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'list',
      category: 'configuration',
      referenceCommand: 'commandchannel',
      aliases: ['listar']
    })
  }

  async run({ t, author, channel, guild }) {
    const clientUser = this.client.user
    const embed = new ClientEmbed(author, { author: [clientUser], thumbnail: guild.iconURL })

    const guildDatabase = this.client.database.guilds
    const { commandsChannel } = await guildDatabase.findOne(guild.id, 'commandsChannel')
    const channels = commandsChannel
      .filter(c => guild.channels.has(c.channelId))
      .map(c => guild.channels.get(c.channelId))

    if (channels.length) {
      embed.setDescription(channels.map(c => `**${c.name}** - \`${c.id}\``).join('\n'))
    } else embed.setColor(Constants.ERROR_COLOR).setTitle(t(`commands:${this.tPath}.noChannels`))

    channel.send(embed)
  }
}