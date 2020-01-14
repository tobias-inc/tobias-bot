const { User, Channel, Attachment } = require("discord.js");
const { CanvasTemplates, Utils, Queue } = require("../../");

class UserWrapper {
  constructor(user, channel, language) {
    if (!(user instanceof User)) throw new Error('The user you entered is not a valid user.');

    Object.entries(user).forEach(([k, v]) => this[k] = v);

    this.channel = channel
    this.language = language

    Object.defineProperty(this, 'user', {
      get: () => user
    })
  }
}

module.exports = class SocialUtils {
  constructor(client) {
    this.client = client;
    this.database = client.database && client.database.users;
    this.social = this.client.controllers && this.client.controllers.social;

    this.queue = new Queue({ globalFunction: this.setGlobalXp.bind(this) });
  }

  upsert(user) {
    if (!this.social) return;
    return this.queue.add([user]);
  }

  async setGlobalXp(user) {
    const xp = Math.floor(Math.random() * 5) + 5;

    if (user instanceof UserWrapper) {
      const { economy: { level, xp: balance } } = await this.social.retrieveProfile(user.id);
      const nextLevel = (balance + xp) > Utils.XPtoNextLevel(level);

      return this.database.update(user.id, {
        $inc: {
          ...({
            'economy.xp': xp,
            'economy.level': nextLevel && 1
          })
        }
      }).then(() => nextLevel && this.sendUpdatedLevel(user, level + 1))
    }
  }

  async sendUpdatedLevel(user, level) {
    try {
      if (user.channel instanceof Channel) {
        const t = this.client.language.lang(user.language);
        const updateImage = await CanvasTemplates.levelUpdated(user.user, { level })

        user.channel.send(
          t('commons:levelup', { level, username: user.username }),
          new Attachment(updateImage, `levelup-${user.id}.jpg`)
        ).catch(() => { })
      }
    } catch (e) {
      this.client.console(true, (e.stack || e), this.constructor.name);
    }

    return true
  }
}

module.exports.userWrapper = UserWrapper;