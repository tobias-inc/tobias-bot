const { Command, CommandError, ClientEmbed } = require("../../");

module.exports = class Queue extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'queue',
      category: 'music',
      aliases: ['q'],
      utils: {
        requirements: { guildOnly: true, guildPlaying: true }
      }
    })
  }

  run({ t, author, channel, guild }) {
    const guildPlayer = this.client.playerManager.get(guild.id);
    const more = guildPlayer.queue.size > 10 ? t('music:andMore', { missing: guildPlayer.queue.size - 10 }) : null;

    if (guildPlayer.queue.size) {
      channel.send(new ClientEmbed(author, { author: [this.client.user], thumbnail: guild.iconURL })
        .setDescription([
          guildPlayer.queue
            .slice(0, 10)
            .map((song, index) => `**\`${index + 1}.\` [${song.title}](${song.uri})**`)
            .join('\n'),
          more
        ].filter(m => m).join('\n'))
      )
    } else {
      throw new CommandError(t('commands:queue.noSize'))
    }
  }
}