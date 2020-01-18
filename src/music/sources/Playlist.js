const moment = require("moment");
const PlaylistStructure = require("../structures/Playlist.js");

module.exports = class Playlist extends PlaylistStructure {
  constructor(songs, playlistInfo, requestedBy, { startedAt, finishedAt }) {
    super(songs, playlistInfo, requestedBy)
    this.loadTime = moment.duration(finishedAt - startedAt).format('m [minutes] s [seconds]', {
      trim: true,
      precision: 3
    })
  }
}