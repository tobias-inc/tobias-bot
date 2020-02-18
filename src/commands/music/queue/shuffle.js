const { Command, CommandError, ClientEmbed } = require('../../../')

module.exports = class QueueShuffle extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'shuffle',
      category: 'music',
      aliases: ['embaralhar', 'sf'],
      referenceCommand: 'queue',
      utils: {
        requirements: { permissions: ['MOVE_MEMBERS'] }
      }
    })
  }

  run ({ t, channel, guild, author }) {
    const guildPlayer = this.client.playerManager.get(guild.id)

    if (guildPlayer.nextSong) {
      guildPlayer.shuffleQueue()
      channel.send(
        new ClientEmbed(author).setDescription(
          t(`commands:${this.tPath}.queueShuffled`)
        )
      )
    } else {
      throw new CommandError(t('music:noneAfterCurrent'))
    }
  }
}
