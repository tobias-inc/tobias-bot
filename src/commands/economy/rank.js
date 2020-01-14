const { Command, ClientEmbed, Utils } = require("../../");

module.exports = class Rank extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'rank',
      category: 'economy',
      utils: {
        requirements: { databaseOnly: true },
        parameters: [{
          type: 'user',
          full: true,
          required: false,
          acceptSelf: true
        }]
      }
    })
  }

  async run({ t, author, channel }, user = author) {
    const { economy: { level, xp } } = await this.client.controllers.social.retrieveProfile(user.id, 'economy');

    channel.send(new ClientEmbed(author, { footer: author, thumbnail: user.displayAvatarURL })
      .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
      .addField('**XP**', `**${xp.toLocaleString()}/${Utils.XPtoNextLevel(level).toLocaleString()}**`)
      .addField('**LEVEL**', `**${level}**`)
    )
  }
}
