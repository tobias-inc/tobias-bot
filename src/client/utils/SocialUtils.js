const { User } = require("discord.js");
const { Utils, Queue } = require("../../");

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

    this.queue = new Queue({
      globalFunction: this.setGlobalXp.bind(this),
      delay: 500,
      randomKey: false
    })
  }

  upsert(user) {
    if (!this.social) return;

    for (let k of this.queue.keys()) {
      if (this.queue.has(k)) return 'has in queue';
    }

    return this.queue.add({ key: user.id, params: [user] });
  }

  async setGlobalXp(user) {
    if (user instanceof UserWrapper) {
      const { economy } = await this.social.retrieveProfile(user.id, 'economy');
      const { level, levels, xp: balance } = economy;

      const xp = Math.floor(((Math.random() * 5) + 1) + (level / 5) * (level / 10));

      const perXP = levels.pop();
      const realXp = perXP.level > 1 ? balance - Utils.XPtoNextLevel(level - 1) : balance;

      const nextLevel = realXp >= perXP.maxXp;

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