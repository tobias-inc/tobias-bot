const { Command, ClientEmbed } = require("../../");

module.exports = class Queue extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'nowplaying',
      category: 'music',
      aliases: ['np'],
      utils: {
        requirements: { guildOnly: true, guildPlaying: true }
      }
    })
  }

  run({ t, author, channel, guild }) {
    const guildPlayer = this.client.playerManager.get(guild.id);
    const song = guildPlayer.playingSong
  }
}