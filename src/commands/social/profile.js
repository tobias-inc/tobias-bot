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
    const social = this.client.controllers.social
    const rank = await this.client.controllers.social.getRank(user.id)
    const profile = await social.retrieveProfile(user.id, 'economy')
    const currentXp = await this.client.controllers.social.currentXp(profile)

    const profileImage = await CanvasTemplates.profile(user, t, {
      ...({ profile: profile.economy, rank, currentXp })
    });

    return channel.send(new Attachment(profileImage, 'profile.png')).then(() => channel.stopTyping());
  }
}