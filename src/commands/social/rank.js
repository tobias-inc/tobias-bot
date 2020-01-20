const { Command, ClientEmbed, Utils } = require("../../");

module.exports = class Rank extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'rank',
      category: 'social',
      utils: {
        requirements: { databaseOnly: true },
        parameters: [{
          type: 'user',
          full: true,
          fetchAll: true,
          required: false,
          acceptSelf: true
        }]
      }
    })
  }

  async run({ t, author, channel }, user = author) {
    const { current, next, level } = await this.client.controllers.social.currentXp(user.id);

    channel.send(new ClientEmbed(author, { footer: author, thumbnail: user.displayAvatarURL })
      .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
      .addField('**XP**', `**${current}/ ${next}**`)
      .addField('**LEVEL**', `** ${level}** `)
    )
  }
}
