const { Command, CommandError, ClientEmbed } = require("../../../");

module.exports = class QueueClear extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'clear',
      category: 'music',
      aliases: ['limpar', 'cl'],
      referenceCommand: 'queue',
      utils: {
        requirements: { permissions: ['MOVE_MEMBERS'] }
      }
    })
  }

  run({ t, channel, guild, author }) {
    const guildPlayer = this.client.playerManager.get(guild.id);

    if (guildPlayer.nextSong) {
      guildPlayer.clearQueue()
      channel.send(new ClientEmbed(author).setDescription(t(`commands:${this.tPath}.queueCleared`)))
    } else {
      throw new CommandError(t('music:noneAfterCurrent'))
    }
  }
}