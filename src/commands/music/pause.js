const { Command } = require('../../')

module.exports = class Pause extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'pause',
      category: 'music',
      utils: {
        requirements: {
          guildOnly: true,
          sameVoiceChannelOnly: true,
          guildPlaying: true
        }
      }
    })
  }

  run ({ message, guild }) {
    const guildPlayer = this.client.playerManager.get(guild.id)
    const pause = !guildPlayer.pause
    message.react(pause ? '▶️' : '⏸️').then(() => guildPlayer.pause(pause))
  }
}
