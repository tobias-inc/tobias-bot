const { Message } = require("discord.js");
const moment = require("moment");

const Permissions = require("./Permissions.js");
const Constants = require("./Constants");

module.exports = class Utils {
  // Moment duration - Utils

  static duration(length, { type = 'ms', format = 'hh:mm:ss', stopTrim = 'm', trim = false, ...moreOptions } = {}) {
    if (!(length instanceof Number) && isNaN(parseInt(length))) return length
    length = parseInt(length)

    const typesParse = { ms: 'milliseconds', s: 'seconds' }
    const typeParsed = typesParse[type] || typesParse['ms']

    return moment.duration(length, typeParsed).format(format, {
      trim,
      stopTrim,
      ...moreOptions
    })
  }

  static replaceTime(i18, time) {
    const t = typeof i18 === 'function' ? i18 : null
    if (!t) throw new TypeError('CONTEXT NOT SET')
    if (!['number', 'string'].includes(typeof time)) return time
    time = time.toString()

    const timeResponses = t('commons:timeResponses', { returnObjects: true });
    const reviews = ['s', 'm', 'h', 'd', 'w', 'mo', 'y']

    let timeStr = time
      .split(' ')
      .map(str => {
        const timeR = parseInt(str.replace(/[^0-9]+/, ''));
        const keyR = str.replace(/[^a-zA-Z]+/, '');

        let keyLower = keyR.toLowerCase()
        if (reviews.includes(keyLower)) {
          return str.replace(new RegExp(keyR), () => {
            const timeResponse = timeResponses.find(key => key[keyR])
            const value = timeR > 1 || timeR === 0 ? timeResponse[`${keyR}_plural`] : timeResponse[keyR]
            return ` ${value}`
          })
        }
        return str
      })

    return timeStr.join(' ')
  }

  // Message

  static reactionCollectorResponse(message, filter,
    { clear, ...options } = { time: 30000, max: 1, maxUsers: 1 }
  ) {
    if (message instanceof Message) {
      return new Promise(resolve => {
        const collector = message.createReactionCollector(filter, options)
        collector.on('collect', () => {
          if (clear) message.clearReactions().catch(() => { })
          resolve(true)
        }).on('end', () => {
          if (clear) message.clearReactions().catch(() => { })
        })
      })
    }
  }

  // Economy

  static XPtoNextLevel(level = 1) {
    return 215 * (level + 1)
  }

  // Client

  static generateInvite(permissions = 8, id = Constants.CLIENT_ID) {
    permissions = typeof permissions === 'undefined' ? 0 : Permissions.resolve(permissions);
    return `https://discordapp.com/oauth2/authorize?client_id=${id}&permissions=${permissions}&scope=bot`
  }

  // Website

  static get website() {
    return process.env.WEBSITE_URL || Constants.WEBSITE_URL
  }

  static websiteUrl(path = '') {
    path = path.startsWith('/') ? path.replace('/', '') : path
    return `${this.website}/${path}`
  }
}