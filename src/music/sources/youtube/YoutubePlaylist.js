const { Playlist } = require("../../structures");

const PLAYLIST_URI = 'https://www.youtube.com/playlist?list=';

module.exports = class YoutubePlaylist extends Playlist {
  constructor(data = {}, songs = [], requestedBy) {
    super(data, songs, requestedBy)

    this.uri = PLAYLIST_URI + this.identifier
    this.title = this.name
  }
}
