const { SongSource } = require("../../structures");
const SpotifyPlaylist = require("./SpotifyPlaylist.js");
const SpotifySong = require("./SpotifySong.js");

module.exports = class SpotifySongSource extends SongSource {
  static get customSources() {
    const albumHandler = ([, id], m, r) => this.provideAlbum(m, id, r);
    const playlistHandler = ([, id], m, r) => this.providePlaylist(m, id, r);
    const trackHandler = ([, id], m, r) => this.getTrack(m, id, r);

    return [
      [
        [/^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com\/track\/([a-zA-Z\d-_]+)/, /spotify:track:([a-zA-Z\d-_]+)$/],
        trackHandler
      ],
      [
        [/^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com\/album\/([a-zA-Z\d-_]+)/, /spotify:album:([a-zA-Z\d-_]+)$/],
        albumHandler
      ],
      [
        [/^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com(?:\/user\/[a-zA-Z\d-_]+)?\/playlist\/([a-zA-Z\d-_]+)/, /^spotify(?::user:[a-zA-Z\d-_]+)?:playlist:([a-zA-Z\d-_]+)/],
        playlistHandler
      ]
    ]
  }

  static async getTrack(manager, id, requestedBy) {
    const track = await manager.client.apis.spotify.getTrack(id)
    return this.provideTrack(manager, track, requestedBy)
  }

  static async providePlaylist(manager, id, requestedBy) {
    const playlist = await manager.client.apis.spotify.getPlaylist(id)
    if (!playlist) return

    const { items } = playlist.tracks
    const videos = (await Promise.all(items.map(({ track }) => this.provideTrack(manager, track, requestedBy)))).filter(i => !!i)
    return new SpotifyPlaylist(playlist, videos, requestedBy)
  }

  static async provideAlbum(manager, id, requestedBy) {
    const album = await manager.client.apis.spotify.getAlbum(id)
    if (!album) return

    const { items } = album.tracks
    const videos = (await Promise.all(items.map(track => this.provideTrack(manager, track, requestedBy, album)))).filter(i => !!i)
    return new SpotifyPlaylist(album, videos, requestedBy)
  }

  static async provideTrack(manager, track, requestedBy, album = track.album) {
    try {
      const song = await this.getClosestVideo(manager, track);
      if (song) {
        return new SpotifySong(song, requestedBy, track, album)
      }
    } catch (e) {
      manager.client.console(true, e)
    }
  }

  static getClosestVideo({ client }, track) {
    return super.getClosestVideo(client, `${track.artists.map(a => a.name).join(', ')} - ${track.name}`)
  }
}
