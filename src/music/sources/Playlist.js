const moment = require("moment");
const PlaylistStructure = require("../structures/Playlist.js");

module.exports = class Playlist extends PlaylistStructure {
  constructor(songs, playlistInfo, requestedBy, { startedAt, finishedAt }) {
    super(songs, playlistInfo, requestedBy)
    this.loadTime = moment.duration(finishedAt - startedAt).format('m[m] s[s]', { stopTrim: 's' });
  }
}