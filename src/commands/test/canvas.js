const { Attachment } = require("discord.js");
const { Command, CanvasTemplates } = require("../../");

module.exports = class Eval extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'canvas',
      category: 'test',
      utils: {
        requirements: { devOnly: true, databaseOnly: true },
        parameters: [{
          type: 'user',
          full: true,
          required: false,
          acceptSelf: true
        }]
      }
    })
  }

  async run({ channel, t, author }, user = author) {
    const { economy } = await this.client.controllers.social.retrieveProfile(user.id, 'economy');
    const rank = await this.client.database.users
      .findAll(['type', 'economy.xp'], { sort: { 'economy.xp': -1 } })
      .then(users => {
        const index = users.findIndex(u => u._id == user.id);
        return index !== -1 ? index + 1 : users.length;
      });

    const canvas = await CanvasTemplates.profile(user, t, economy, rank);
    return channel.send(new Attachment(canvas, 'profile.png'));
  }
}