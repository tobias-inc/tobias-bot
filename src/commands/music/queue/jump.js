const { Command, CommandError } = require("../../../");

module.exports = class QueueJump extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'jump',
      category: 'music',
      aliases: ['pular'],
      referenceCommand: 'queue',
      utils: {
        requirements: { permissions: ['MOVE_MEMBERS'] },
        parameters: [{
          type: 'number',
          full: true,
          min: 1,
          missingError: ({ t }) => t(`commands:${this.tPath}.missingIndexParameter`)
        }]
      }
    })
  }

  run({ t, guild, message }, index) {
    const guildPlayer = this.client.playerManager.get(guild.id);

    if (guildPlayer.nextSong) {
      try {
        guildPlayer.jumpToIndex(Math.round(index) - 1)
        message.react('⤴️').catch(() => { })
      } catch (e) {
        throw new CommandError(t(`commands:${this.tPath}.missingIndexParameter`))
      }
    } else {
      throw new CommandError(t('music:noneAfterCurrent'))
    }
  }
}