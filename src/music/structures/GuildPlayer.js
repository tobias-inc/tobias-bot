const { Player } = require("discord.js-lavalink");
const Queue = require("./Queue.js");

module.exports = class GuildPlayer extends Player {
  constructor(options) {
    super(options)

    this._volume = 50
    this._loop = false
    this._bassboost = false

    Object.defineProperty(this, 'queue', {
      value: new Queue()
    })

    this.on('end', ({ reason }) => {
      if (reason === 'REPLACED') return
      this.playingSong.emit('end')
      if (reason !== 'STOPPED') this.next()
    })

    this.on('stop', () => {
      this.playingSong = null
      this.manager.leave(this.id)
    })

    this.on('error', console.log)
  }

  get nextSong() {
    return this.queue[0]
  }

  get bassboosted() {
    return this._bassboost
  }

  get looping() {
    return this._loop
  }

  event(message) {
    if (message.op === 'playerUpdate') {
      this.state = Object.assign(this.state, { volume: this._volume }, message.state)
    } else {
      super.event(message)
    }
  }

  play(song, forcePlay = false, options = {}) {
    if (this.playing && !forcePlay) {
      this.queueTrack(song);
      return false
    }

    this.playingSong = song
    song.emit('start')

    super.play(song.track, options)
    this.volume(this._volume)
    this.graveEqualizer()
    return true
  }

  queueTrack(song, silent = false) {
    this.queueTracks([song], silent)
    return song
  }

  queueTracks(songs, silent = false) {
    this.queue.push(...songs)
    if (!silent) songs.forEach(s => s.emit('queue'))
    return songs
  }

  stop() {
    this.queue.purge()
    this.emit('stop')
    super.stop()
  }

  next(user) {
    if (this._loop) this.queueTrack(this.playingSong, true)
    const nextSong = this.queue.shift()
    if (nextSong) {
      this.playingSong.emit('removed')
      this.play(nextSong, true)
      return true
    } else {
      super.stop()
      this.playingSong.emit('stop', user)
      this.emit('stop', user)
    }

    return false
  }

  clearQueue() {
    return this.queue.purge()
  }

  shuffleQueue() {
    return this.queue.shuffle()
  }

  removeFromQueue(index) {
    if (index < 0 || index >= this.queue.length) throw new Error('INDEX_OUT_OF_BOUNDS')
    return this.queue.remove(index)
  }

  jumpToIndex(index, ignoreLoop = false) {
    if (index < 0 || index >= this.queue.length) throw new Error('INDEX_OUT_OF_BOUNDS')

    const songs = this.queue.splice(0, index + 1)
    const song = songs.pop()
    if (!ignoreLoop && this._loop) this.queueTracks([this.playingSong, ...songs])
    this.play(song, true)

    return song
  }

  volume(volume = 50) {
    this._volume = volume
    super.volume(volume)
  }

  graveEqualizer() {
    this.volume(80)
    return this.setEQ([
      { band: 0, gain: 0.5 },
      { band: 1, gain: 0 },
      { band: 2, gain: 0 },
      { band: 3, gain: 0.2 },
      { band: 4, gain: 0.4 },
      { band: 5, gain: 0.2 }
    ])
  }

  loop(loop = true) {
    this._loop = !!loop
  }

  bassboost(state = true) {
    this._bassboost = state
    if (state) {
      this._previousVolume = this._volume
      this.volume(150)
      this.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 1 })))
      return true
    }

    if (this._previousVolume !== null) this.volume(this._previousVolume)
    this.setEQ(Array(6).fill(0).map((n, i) => ({ band: i, gain: 0 })))
    return false
  }

  setEQ(bands) {
    this.node.send({
      op: 'equalizer',
      guildId: this.id,
      bands
    })
    return true
  }
}