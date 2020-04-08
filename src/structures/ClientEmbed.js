const { MessageEmbed, User } = require('discord.js')
const Constants = require('../utils/Constants.js')

const hasUser = U => U instanceof User

module.exports = class ClientEmbed extends MessageEmbed {
  /**
   * @param {<User>} u Instanceof for discord.js User
   * @param {Object} [d] Data for embed.
   * @param {String} [d.url]
   * @param {String} [d.title]
   * @param {String|Buffer} [d.image]
   * @param {String} [d.thumbnail]
   * @param {String} [d.description]
   * @param {Date} [d.timestamp]
   * @param {String} [d.color]
   * @param {Boolean} [d.footer]
   * @param {Object} [d.author]
   * @param {<User>} [d.author.user]
   * @param {String} [d.author.url]
   */
  constructor (u, d = {}) {
    super()

    const data = this.resolveData(u, d)

    if (data.url) this.setURL(data.url)
    if (data.color) this.setColor(data.color)
    if (data.title) this.setTitle(data.title)
    if (data.author) {
      this.setAuthor(
        data.author.username,
        data.author.displayAvatarURL,
        data.author.url
      )
    }
    if (data.timestamp) this.setTimestamp(data.timestamp)
    if (data.image) this.setImage(data.image)
    if (data.thumbnail) this.setThumbnail(data.thumbnail)
    if (data.footer) this.setFooter(u.username, u.displayAvatarURL)
  }

  resolveData (user, data) {
    const [author, url] = data.author || []
    return {
      url: data.url,
      title: data.title,
      image: data.image,
      thumbnail: data.thumbnail,
      description: data.description,
      timestamp: data.timestamp || Date.now(),
      color: data.EMBED_COLOR || Constants.EMBED_COLOR,
      footer: hasUser(user),
      author: hasUser(author)
        ? { ...author, url: url || author.displayAvatarURL }
        : null
    }
  }
}
