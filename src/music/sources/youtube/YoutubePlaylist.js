const { Playlist } = require("../../structures");
const YoutubeSong = require("./YoutubeSong.js");

const PLAYLIST_URI = 'https://www.youtube.com/playlist?list=';

module.exports = class YoutubePlaylist extends Playlist {
  constructor(data = {}, songs = [], requestedBy, Youtube) {
    super(data, songs, requestedBy)

    this.uri = PLAYLIST_URI + this.identifier
    this._Youtube = Youtube
  }
}
