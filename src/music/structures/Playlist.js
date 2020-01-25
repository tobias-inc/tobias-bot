const { EventEmitter } = require("events");
const moment = require("moment");

const Song = require('./Song.js')

module.exports = class Playlist extends EventEmitter {
  constructor(data = {}, songs = [], requestedBy) {
    super()

    const response = parseInt(Date.now() - requestedBy.startedLoadingAt)
    this.loadTime = moment
      .duration(response)
      .format(response >= 60000 ? 'm[m]' : 's[s]', {
        useToLocaleString: false,
        decimalSeparator: ".",
        precision: response <= 100 ? 3 : response >= 10000 ? 1 : 2
      })

    if (data.playlistInfo) {
      this.title = data.playlistInfo.name
      this.uri = data.playlistInfo.url
    }

    this.identifier = data.identifier
    this.source = data.source
    this.requestedBy = requestedBy
    this.songs = songs
  }

  loadInfo() {
    this.songs = this.songs.map(s => new Song(s, this.requestedBy))
    return this
  }

  get size() {
    return this.songs.length
  }

  get length() {
    return this.songs.reduce((l, s) => l + s.ms, 0)
  }

  get formattedDuration() {
    if (this.isStream) return ''
    return moment.duration(this.length).format(this.length >= 3600000 ? 'hh:mm:ss' : 'mm:ss', { trim: false })
  }
}