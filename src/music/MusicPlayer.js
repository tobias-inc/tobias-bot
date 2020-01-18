const { PlayerManager } = require("discord.js-lavalink");
const fetch = require("node-fetch");

const GuildPlayer = require("./structures/GuildPlayer.js");

const { Playlist, Song, PlaylistURI } = require("./sources");

const DEFAULT_JOIN_OPTIONS = { selfdeaf: true }

const defaultRegions = {
  asia: ['sydney', 'singapore', 'japan', 'hongkong'],
  eu: ['london', 'frankfurt', 'amsterdam', 'russia', 'eu-central', 'eu-west', 'southafrica'],
  us: ['us-central', 'us-west', 'us-east', 'us-south'],
  sam: ['brazil']
}

const resolveRegion = (region) => {
  region = region.replace('vip-', '')
  const dRegion = Object.entries(defaultRegions).find(([, r]) => r.includes(region))
  return dRegion && dRegion[0]
}

module.exports = class MusicPlayer extends PlayerManager {
  constructor(client, nodes = [], options = {}) {
    options.player = GuildPlayer
    super(client, nodes, options);

    Object.defineProperty(this, 'REST_ADDRESS', {
      get: () => `${nodes[0].host}:${nodes[0].port}`
    })

    Object.defineProperty(this, 'REST_PASSWORD', {
      get: () => nodes[0].password
    })
  }

  async fetchTracks(identifier) {
    const params = new URLSearchParams({ identifier });
    const result = await fetch(`http://${this.REST_ADDRESS}/loadtracks?${params.toString()}`, {
      headers: {
        Authorization: this.REST_PASSWORD
      }
    }).then(res => res.json()).catch(err => {
      this.client.console(true, err.stack || err, 'PlayerManager', 'searchSong')
      return false
    })

    if (!result) return false;
    if (['LOAD_FAILED', 'NO_MATCHES'].includes(result.loadType) || !result.tracks.length) return null;

    return result
  }

  async loadIdentifier(search, requestedBy) {
    const songs = await this.fetchTracks(search);

    if (songs) {
      const { tracks, loadType, playlistInfo } = songs;

      switch (loadType) {
        case 'PLAYLIST_LOADED':
          playlistInfo.uri = PlaylistURI(search);
          return new Playlist(tracks, playlistInfo, requestedBy)
        default:
          return new Song(tracks[0], requestedBy)
      }
    }

    return null
  }

  play(song, channel) {
    const host = this.getIdealHost(channel.guild.region);
    const player = this.join({
      guild: channel.guild.id,
      channel: channel.id,
      host
    }, DEFAULT_JOIN_OPTIONS);

    player.play(song);
    return song
  }

  getIdealHost(region) {
    region = resolveRegion(region)
    const { host } = (region && this.nodes.find(n => n.ready && n.region === region)) || this.nodes.first()
    return host
  }
}