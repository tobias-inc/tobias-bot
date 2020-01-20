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

    this.startedAt = requestedBy.startedLoadingAt
    this.finishedAt = Date.now()
  }

  loadInfo() {
    this.songs = this.songs.map(s => new Song(s, this.requestedBy))
    return this
  }

  get size() {
    return this.songs.length
  }

  get loadTime() {
    const response = this.finishedAt - this.startedAt;
    return moment.duration(response).format(response > 200 ? 's [seconds]' : 'S [milissegundos]', {
      trim: true,
      precision: response > 200 ? 2 : 0
    })
  }

  get length() {
    return this.songs.reduce((l, s) => l + s.ms, 0)
  }

  get formattedDuration() {
    if (this.isStream) return ''
    return moment.duration(this.length).format(this.length >= 3600000 ? 'hh:mm:ss' : 'mm:ss', { trim: false })
  }
}
