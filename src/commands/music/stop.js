const { Command, ClientEmbed } = require('../../')

module.exports = class Stop extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'stop',
      category: 'music',
      utils: {
        requirements: {
          guildOnly: true,
          sameVoiceChannelOnly: true,
          guildPlaying: true,
          permissions: ['MOVE_MEMBERS']
        }
      }
    })
  }

  run ({ t, author, channel, guild }) {
    const guildPlayer = this.client.playerManager.get(guild.id)
    channel
      .send(new ClientEmbed(author).setDescription(t('commands:stop.stopped')))
      .then(() => guildPlayer.stop(author))
  }
}
