const { User } = require("discord.js");
const { Queue } = require("../../");

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

    this.queue = new Queue({
      globalFunction: this.setGlobalXp.bind(this),
      delay: 500,
      randomKey: false
    })
  }

  get database() {
    return this.client.database && this.client.database.users
  }

  get social() {
    return this.client.controllers.social
  }

  upsert(user) {
    if (!this.social) return;
    if (this.queue.has(user.id)) return 'has in queue';

    return this.queue.add({ key: user.id, params: [user] });
  }

  async setGlobalXp(user) {
    if (user instanceof UserWrapper) {
      const information = Promise.all([
        this.social.retrieveProfile(user.id),
        this.social.currentXp(user.id),
      ])

      const [{ economy }, { current, next, level }] = await information;

      const xp = Math.floor(((Math.random() * 5) + 3) + (level / 5) * (level / 10));
      const nextLevel = current >= next;

      return this.database.update(user.id, {
        $inc: {
          ...({
            'economy.xp': xp,
            'economy.level': nextLevel && 1
          })
        }
      }).then(() => nextLevel && this.client.emit('userLevelUp', user, { ...economy, level: level + 1 }))
    }
  }
}

module.exports.userWrapper = UserWrapper;