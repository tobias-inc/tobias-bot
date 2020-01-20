const { EventEmitter } = require("events");
const moment = require("moment");

const Song = require('./Song.js')

module.exports = class Playlist extends EventEmitter {
  constructor(data = {}, songs = [], requestedBy) {
    super()

    this.identifier = data.identifier
    this.source = data.source
    this.requestedBy = requestedBy
    this.songs = songs

    this.loadTime = moment.duration(requestedBy.startedLoadingAt - Date.now()).format('m [minutes] s [seconds]', {
      trim: true,
      precision: 2
    })
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