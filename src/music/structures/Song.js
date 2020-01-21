const { EventEmitter } = require("events");
const moment = require("moment");

const DEFAULT_THUMBNAIL_URL = 'https://i.ytimg.com/vi/{id}/maxresdefault.jpg';

module.exports = class Song extends EventEmitter {
  constructor(data = {}, requestedBy) {
    super()

    this.title = data.info.title
    this.author = data.info.author
    this.uri = data.info.uri

    this.identifier = data.info.identifier
    this.isSeekable = data.info.isSeekable
    this.isStream = data.info.isStream
    this.position = data.info.position
    this.ms = data.info.length

    this.addedAt = Date.now()
    this.startedAt = null
    this.message = null

    this.artwork = DEFAULT_THUMBNAIL_URL.replace('{id}', this.identifier)

    Object.defineProperty(this, 'requestedBy', { get: () => requestedBy || data.requestedBy })
    Object.defineProperty(this, 'track', { get: () => data.track })

    this.on('stop', () => this.removeAllListeners())
    this.on('removed', () => this.deleteMessage())
    this.on('start', () => this.handleStart())
  }

  get formattedDuration() {
    if (this.isStream) return ''
    return moment.duration(this.ms).format('hh:mm:ss', { stopTrim: 'm' })
  }

  get addedFormat() {
    return moment(this.addedAt).calendar()
  }

  get backgroundImage() {
    return this.artwork
  }

  loadInfo() {
    return this
  }

  handleStart() {
    this.removeAllListeners('queue')
    this.startedAt = new Date()
  }

  setMessage(m) {
    this.message = m
  }

  async deleteMessage() {
    try {
      await this.message.delete()
    } catch (e) { }
    return true
  }
}