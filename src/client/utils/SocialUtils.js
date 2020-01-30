const { User } = require("discord.js");
const { Queue } = require("../../");

class UserWrapper {
  constructor(user, channel, language) {
    if (!(user instanceof User)) throw new Error('The user you entered is not a valid user.');

    Object.entries(user).forEach(([k, v]) => this[k] = v);

    this.channel = channel
    this.language = language

    Object.defineProperty(this, 'user', { value: user })
  }
}

module.exports = class SocialUtils {
  constructor(client) {
    this.client = client;

    this.queue = new Queue({
      globalFunction: this.setGlobalXp.bind(this),
      delay: 1000,
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
      const getClaim = [true, true, false].sort(() => Math.random() > 0.5 ? -1 : 1)[0]
      if (!getClaim) return

      const multiplique = l => {
        const reduceValue = Math.floor(Math.random() * l) + l / l * 0.5;
        return Math.floor((Math.random() * 2) + reduceValue / 5)
      }

      const profile = await this.social.retrieveProfile(user.id)
      const { current, next, level } = await this.social.currentXp(profile)

      let xp = Math.floor((Math.random() * 4) + 2);
      xp = xp === 2 ? xp * (multiplique(level) || 1) : xp;

      const nextLevel = current + xp >= next;

      return this.database.update(user.id, {
        $inc: {
          ...({
            'economy.xp': xp,
            'economy.level': nextLevel && 1
          })
        }
      }).then(() => nextLevel && this.client.emit('userLevelUp', user, { ...profile.economy, level: level + 1 }))
    }
  }
}

module.exports.userWrapper = UserWrapper;