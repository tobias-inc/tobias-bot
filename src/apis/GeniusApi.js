const Genius = require('genius-api')
const GetLyrics = require('lyricist')
const { Wrapper } = require('../')

module.exports = class GeniusWrapper extends Wrapper {
  constructor () {
    super('geniusapi')
    this.envVars = ['GENIUS_API']
  }

  load () {
    this.client.apis.geniusapi = new Genius(process.env.GENIUS_API)
    this.client.apis.lyrics = new GetLyrics(process.env.GENIUS_API)
    console.log(this)
    return true
  }

  findTrack (search) {
    return this.api.Genius.search(search).then(res => {
      if (!res.hits.length) return res
      else {
        for (let i = 0; i < res.hits.length; i++) {
          const {
            result: {
              song_art_image_thumbnail_url: thumbnailUrl,
              title_with_featured: title,
              primary_artist: { name: artist },
              url, id, path
            }
          } = res.hits[i]
          res.hits[i] = { thumbnailUrl, title, artist, url, path, id }
        }
        return res
      }
    })
  }

  loadLyrics (query) {
    return this.api.lyrics.song(query, { fetchLyrics: true }).then(res => res.lyrics)
  }
}
