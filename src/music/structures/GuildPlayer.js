const { Collection } = require("discord.js");
const { Player } = require("discord.js-lavalink");
const moment = require("moment");

const Queue = require("./Queue.js");

module.exports = class GuildPlayer extends Player {
  constructor(options = {}) {
    super(options)

    this.on('end', ({ reason }) => {
      if (reason === 'REPLACED') return
      this.playingSong.emit('end')
      if (reason !== 'STOPPED') this.next()
    })

    this.on('stop', () => {
      this.playingSong = null
      this.manager.leave(this.id)
    })

    this.on('error', (e) => {
      console.log(e)
      this.playingSong.emit('error')
      return this.stop()
    })

    this._volume = 80
    this._loop = false

    this._previousVolume = null
    this._bassboost = false

    this._listening = new Collection()

    Object.defineProperty(this, 'queue', { value: new Queue() })
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
      this.queueTrack(song)
      return false
    }

    super.play(song.track, options)
    this.playingSong = song
    this.volume(this._volume)
    this.graveEqualizer()
    song.emit('start')
    return true
  }

  stop() {
    this.queue.purge()
    this._listening.clear()
    this.emit('stop')
    super.stop()
  }

  leaveOnEmpty(user) {
    this.playingSong.emit('abruptStop', user)
    this.stop()
  }

  next(user) {
    if (this._loop) this.queueTrack(this.playingSong, true)
    const nextSong = this.queue.shift()
    if (nextSong) {
      this.play(nextSong, true)
      return nextSong
    } else {
      super.stop()
      this.playingSong.emit('stop', user)
      this.emit('stop', user)
    }
  }

  get nextSong() {
    return this.queue[0]
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

  get bassboosted() {
    return this._bassboost
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

  get looping() {
    return this._loop
  }

  loop(loop = true) {
    this._loop = !!loop
  }

  graveEqualizer() {
    return this.setEQ([
      { band: 0, gain: 0 },
      { band: 1, gain: 0 },
      { band: 2, gain: 0 },
      { band: 3, gain: 0 },
      { band: 4, gain: 0.2 },
      { band: 5, gain: 0.2 }
    ])
  }

  get formattedElapsed() {
    if (!this.playingSong || this.playingSong.isStream) return ''
    return moment.duration(this.state.position).format('hh:mm:ss', { stopTrim: 'm' })
  }

  get voiceChannel() {
    return this.client.channels.get(this.channel)
  }

  setEQ(bands) {
    this.node.send({
      op: 'equalizer',
      guildId: this.id,
      bands
    })
    return this
  }

  async updateVoiceState(oldMember, newMember) {
    const switchId = newMember.guild.me.user.id
    if (newMember.user.bot && newMember.user.id !== switchId) return
    const { voiceChannel: oldChannel } = oldMember
    const { voiceChannel: newChannel } = newMember
    const isSwitch = newMember.user.id === switchId
    if (newMember.user.bot && !isSwitch) return

    if (!oldChannel && newChannel) {
      if (!isSwitch && !newChannel.members.has(switchId)) return
    }

    if (oldChannel && !newChannel) {
      if (isSwitch) oldChannel.members.filter(m => !m.user.bot).forEach(m => this._listening.delete(m.user.id))
      if (oldChannel.members.size === 1 && oldChannel.members.has(switchId)) this.leaveOnEmpty(newMember.user.id)
      else if (oldChannel.members.has(switchId)) this._listening.delete(newMember.user.id)
      else return
    }
    if (oldChannel && newChannel) {
      if (oldChannel.id === newChannel.id) return
      else if (!oldChannel.equals(newChannel)) {
        if (oldChannel.members.has(switchId)) this._listening.delete(newMember.user.id)
      }
    }
  }
}