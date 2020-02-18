const { Song } = require('../../structures')
const Constants = require('../../../utils/Constants.js')

module.exports = class YoutubeSong extends Song {
  constructor (data = {}, requestedBy) {
    super(data, requestedBy)
    this.artwork = `https://i.ytimg.com/vi/${this.identifier}/hqdefault.jpg`
    this.color = Constants.YOUTUBE_COLOR
    this.source = 'youtube'
  }
}
