const { Attachment } = require("discord.js");
const { Command, CanvasTemplates } = require("../../");

module.exports = class Eval extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'canvas',
      category: 'test',
      utils: {
        requirements: { devOnly: true }
      }
    })
  }

  async run({ channel, t, author }) {
    const canvas = await CanvasTemplates.levelUpdated(author, 2);

    return channel.send(
      `**${author.tag}** subiu de nível!`,
      new Attachment(canvas, 'updateRank.png')
    );
  }
}