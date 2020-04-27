const { MessageEmbed } = require('discord.js')
const Constants = require('../utils/Constants')

module.exports = class ClientEmbed extends MessageEmbed {
  constructor (user) {
    super({})
    // eslint-disable-next-line no-undef
    this.setColor(Constants.EMBED_COLOR)
    this.setTimestamp()
    if (user) this.setFooter(user.username, user.displayAvatarURL())
  }
}
