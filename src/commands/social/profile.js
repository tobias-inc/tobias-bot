const { Attachment } = require("discord.js");
const { Command, CanvasTemplates } = require("../../");

module.exports = class Eval extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'profile',
      category: 'social',
      aliases: ['perfil'],
      utils: {
        requirements: { databaseOnly: true, canvasOnly: true },
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
    const informations = Promise.all([
      this.client.controllers.social.retrieveProfile(user.id, 'economy'),
      this.client.controllers.social.getRank(user.id),
      this.client.controllers.social.currentXp(user.id)
    ])

    const [{ economy: profile }, rank, currentXp] = await informations;

    const canvas = await CanvasTemplates.profile(user, t, {
      ...({
        profile,
        rank,
        currentXp
      })
    });

    return channel.send(new Attachment(canvas, 'profile.jpg'));
  }
}