const { Playlist } = require('../../structures')
const SoundcloudSong = require('./SoundcloudSong.js')

module.exports = class SoundcloudPlaylist extends Playlist {
  constructor (data = {}, songs = [], requestedBy) {
    super(data, songs, requestedBy)
    this.source = 'soundcloud'
  }

  loadInfo () {
    this.songs = this.songs.map(s => new SoundcloudSong(s, this.requestedBy))
    return this
  }
}
