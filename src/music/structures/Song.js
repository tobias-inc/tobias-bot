const { EventEmitter } = require("events");
const moment = require("moment");

module.exports = class SongQueue extends EventEmitter {
  constructor(song = {}, requestedBy) {
    super()

    this.track = song.track
    this.silent = song.silent || false

    this.title = song.info.title
    this.author = song.info.author
    this.uri = song.info.uri

    this.identifier = song.info.identifier
    this.isSeekable = song.info.isSeekable
    this.isStream = song.info.isStream
    this.position = song.info.position
    this.ms = song.info.length

    this.addedAt = Date.now()
    this.startedAt = null
    this.message = null

    Object.defineProperty(this, 'requestedBy', { get: () => requestedBy })

    this.on('start', () => this.handleStart())
    this.on('stop', () => this.removeAllListeners())
    this.on('removed', () => this.deleteMessage())
  }

  get formattedDuration() {
    if (this.isStream) return 0
    return moment.duration(this.ms).format('hh:mm:ss', { stopTrim: 'm' })
  }

  handleStart() {
    this.removeAllListeners('queue')
    this.startedAt = new Date()
  }

  setMessage(m) {
    this.message = m
  }

  async deleteMessage() {
    if (this.message) try {
      await this.message.delete()
    } catch (e) { }
    return true
  }
}