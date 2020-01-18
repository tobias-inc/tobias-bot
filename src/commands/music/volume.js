const { Command, ClientEmbed } = require("../../");

const MAX_VOLUME = 150;

module.exports = class Eval extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'volume',
      category: 'music',
      utils: {
        requirements: {
          guildOnly: true,
          sameVoiceChannelOnly: true,
          guildPlaying: true,
          permissions: ['MOVE_MEMBERS'],
          errors: {
            guildPlaying: 'commands:volume.notPlaying'
          }
        },
        parameters: [{
          type: 'number',
          full: true,
          min: 0,
          max: MAX_VOLUME,
          forceMin: true,
          forceMax: true,
          missingError: 'commands:volume.missingVolumeParameter'
        }]
      }
    })
  }

  run({ t, author, channel, guild }, volume) {
    const guildPlayer = this.client.playerManager.get(guild.id);

    if (volume !== MAX_VOLUME && guildPlayer.bassboosted) guildPlayer.bassboost(false);

    channel.send(new ClientEmbed(author)
      .setDescription(t('commands:volume.volumeSet', { volume }))
    ).then(() => guildPlayer.volume(volume))
  }
}