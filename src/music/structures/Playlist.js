const moment = require("moment");
const Song = require("./Song.js");

module.exports = class PlaylistQueue {
  constructor(songs = [], playlistInfo = {}, requestedBy) {
    this.title = playlistInfo.name
    this.uri = playlistInfo.uri
    this.size = songs.length

    this.playlistSelectedTrack = playlistInfo.selectedTrack

    this.songs = songs.map(song => new Song(song, requestedBy))
    this.addedBy = requestedBy
  }

  get length() {
    return this.songs.reduce((l, s) => l + s.ms, 0)
  }

  get formattedDuration() {
    if (this.isStream) return ''
    return moment.duration(this.length).format(this.length >= 3600000 ? 'hh:mm:ss' : 'mm:ss', { trim: false })
  }
}