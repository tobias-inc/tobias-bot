const { Attachment } = require("discord.js");
const { Command, CanvasTemplates } = require("../../");

module.exports = class Profile extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'profile',
      category: 'social',
      aliases: ['perfil'],
      utils: {
        requirements: { databaseOnly: true, canvasOnly: true },
        parameters: [{ type: 'user', fetchAll: true, required: false, acceptSelf: true }]
      }
    })
  }

  async run({ channel, t, author }, user = author) {
    channel.startTyping()
    const informations = Promise.all([
      this.client.controllers.social.retrieveProfile(user.id, 'economy'),
      this.client.controllers.social.getRank(user.id)
    ])

    const [profile, rank] = await informations;
    const currentXp = await this.client.controllers.social.currentXp(profile)
    const canvas = await CanvasTemplates.profile(user, t, {
      ...({ profile: profile.economy, rank, currentXp })
    });

    return channel.send(new Attachment(canvas, 'profile.jpg')).then(() => channel.stopTyping());
  }
}