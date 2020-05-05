const { getAlbumArt, getLyrics } = require('genius-lyrics-api')
const { Wrapper } = require('../')

module.exports = class GeniusWrapper extends Wrapper {
  constructor () {
    super('geniusapi')
  }

  loadLyrics (title, artist) {
    const options = {
      apiKey: process.env.GENIUS_API,
      title,
      artist
    }
    return getLyrics(options)
  }

  loadArt (title, artist) {
    const options = {
      apiKey: process.env.GENIUS_API,
      title,
      artist
    }
    return getAlbumArt(options)
  }
}
