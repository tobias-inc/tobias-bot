const Genius = require('genius-lyrics-api')
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
    const res =
    {
      Lyric: Genius.getLyrics(options),
      Art: Genius.getAlbumArt(options)
    }
    return res
  }
}
