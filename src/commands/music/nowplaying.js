const { Attachment } = require("discord.js");
const { Command } = require("../../");

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

  async run({ t, author, channel, guild }) {
    delete require.cache[require.resolve('../../utils/canvas/CanvasTemplates.js')];
    const CanvasTemplates = require('../../utils/canvas/CanvasTemplates.js');

    const guildPlayer = this.client.playerManager.get(guild.id);
    const song = guildPlayer.playingSong

    const np = await CanvasTemplates.nowPlaying(t, guildPlayer, song)
    return channel.send(new Attachment(np, 'nowplaying.jpg'))
  }
}