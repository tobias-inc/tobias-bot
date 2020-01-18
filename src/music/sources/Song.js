const SongStructure = require("../structures/Song.js");

module.exports = class Song extends SongStructure {
  constructor(song, requestedBy) {
    super(song, requestedBy)
  }
}