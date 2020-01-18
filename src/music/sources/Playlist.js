const PlaylistStructure = require("../structures/Playlist.js");

module.exports = class Playlist extends PlaylistStructure {
  constructor(songs, playlistInfo, requestedBy) {
    super(songs, playlistInfo, requestedBy)
  }
}