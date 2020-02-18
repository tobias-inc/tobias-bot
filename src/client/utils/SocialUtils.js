const { User } = require('discord.js')
const { Queue } = require('../../')

const multiplique = l => {
  const reduceValue = Math.floor(Math.random() * l) + (l / l) * 0.5
  return Math.floor(Math.random() * 2 + reduceValue / 5)
}

class UserWrapper {
  constructor (user, channel, language) {
    if (!(user instanceof User)) { throw new Error('The user you entered is not a valid user.') }

    this.channel = channel
    this.language = language

    Object.entries(user).forEach(([k, v]) => (this[k] = v))
    Object.defineProperty(this, 'user', { value: user })
  }
}

module.exports = class SocialUtils {
  constructor (client) {
    this.client = client

    this.queue = new Queue({
      globalFunction: this.setGlobalXp.bind(this),
      delay: 1000,
      randomKey: false
    })
  }

  get database () {
    return this.client.database
  }

  get social () {
    return this.client.controllers.social
  }

  upsert (user) {
    if (!this.social || this.queue.has(user.id)) return
    return this.queue.add({ key: user.id, params: [user] })
  }

  async setGlobalXp (user) {
    if (user instanceof UserWrapper) {
      const getClaim = [true, true, true, false].sort(() =>
        Math.random() > 0.5 ? -1 : 1
      )[0] // 75%
      if (!getClaim) return

      const profile = await this.social.retrieveProfile(user.id)
      const { current, next, level } = await this.social.currentXp(profile)

      const guildId = user.channel.guild.id
      const hasGuildExperience = profile.economy.guildExperience.some(
        ge => ge.guildId === guildId
      )

      if (!hasGuildExperience) {
        await this.database.users.update(user.id, {
          $push: {
            'economy.guildExperience': { guildId }
          }
        })
      }

      const nultiplicateValue = multiplique(level)
      const gainedXP = Math.floor(Math.random() * 6 + 4)
      const xp =
        gainedXP === 2
          ? gainedXP * (nultiplicateValue > 1 ? nultiplicateValue : 1)
          : gainedXP

      const nextLevel = current + xp >= next

      return this.database.users
        .update(
          user.id,
          {
            $inc: {
              ...{
                'economy.xp': xp,
                'economy.level': nextLevel && 1,
                'economy.guildExperience.$[g].xp': xp
              }
            }
          },
          {
            arrayFilters: [{ 'g.guildId': guildId }]
          }
        )
        .then(
          () =>
            nextLevel &&
            this.client.emit('userLevelUp', user, {
              ...profile.economy,
              level: level + 1
            })
        )
    }
  }
}

module.exports.userWrapper = UserWrapper
