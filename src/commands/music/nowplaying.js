const { Attachment } = require("discord.js");
const { Command, CanvasTemplates } = require("../../");

module.exports = class Queue extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'nowplaying',
      category: 'music',
      aliases: ['np'],
      utils: {
        requirements: { guildOnly: true, guildPlaying: true, canvasOnly: true }
      }
    })
  }

  async run({ t, channel, guild }) {
    channel.startTyping()
    const guildPlayer = this.client.playerManager.get(guild.id);
    const song = guildPlayer.playingSong

    const np = await CanvasTemplates.nowPlaying(t, guildPlayer, song)
    return channel.send(new Attachment(np, 'nowplaying.jpg')).then(()=> channel.stopTyping())
  }
}