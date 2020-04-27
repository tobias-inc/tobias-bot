const { Playlist } = require('../../musicStructures')
const YoutubeSong = require('./YoutubeSong.js')

const PLAYLIST_URI = 'https://www.youtube.com/playlist?list='

module.exports = class YoutubePlaylist extends Playlist {
  constructor (data = {}, songs = [], requestedBy) {
    super(data, songs, requestedBy)
    this.uri = PLAYLIST_URI + this.identifier
    this.title = data.playlistInfo.name
    this.source = 'youtube'
  }

  loadInfo () {
    this.songs = this.songs.map(s => new YoutubeSong(s, this.requestedBy))
    return this
  }
}
