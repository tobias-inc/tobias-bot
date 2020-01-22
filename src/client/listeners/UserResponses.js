const { Channel, Attachment } = require("discord.js");
const { CanvasTemplates, Listener, Utils } = require("../../");

module.exports = class UserResponses extends Listener {
  constructor(client) {
    super(client)

    this.events = ['userLevelUp']
    this.module = this.client.database && this.client.database.guilds;
    this.social = client.database && client.database.users;
  }

  async onUserLevelUp(user, userDocument) {
    const level = userDocument.level;
    const channel = user.channel;

    try {
      const insertNewLevel = await this.social.update(user.id, {
        $push: {
          'economy.levels': {
            level, maxXp: Utils.XPtoNextLevel(userDocument.level)
          }
        }
      })

      // Send

      if (channel instanceof Channel) {
        const { systemsDisabled } = await this.module.findOne(channel.guild.id, 'systemsDisabled');

        if (systemsDisabled.some(system => system.name.toUpperCase() === 'LEVEL_UP')) return;

        const t = this.client.language.lang(user.language);
        const updateImage = await CanvasTemplates.levelUpdated(user.user, t, userDocument)

        channel
          .send(
            t('economy:levelup', { level, username: user.username }),
            new Attachment(updateImage, 'levelup.jpg')
          )
          .catch(() => null)

        return insertNewLevel
      }
    } catch (e) {
      this.client.console(true, (e.stack || e), this.constructor.name);
    }

    return false
  }
}