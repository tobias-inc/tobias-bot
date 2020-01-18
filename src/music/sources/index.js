const Song = require("../structures/Song.js");
const Playlist = require("../structures/Playlist.js");

const YOUTUBE_TRACK_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
const YOUTUBE_PLAYLIST_REGEX = /https?:\/\/(www.youtube.com|youtube.com)\/playlist\?list=((\w|-){34})/;

module.exports = {
  Song: require("./Song.js"),
  Playlist: require("./Playlist.js"),

  Test: (source) => {
    if (source instanceof Song) return 'Song';
    if (source instanceof Playlist) return 'Playlist';

    return false
  },

  Identify: (insert) => {
    if (YOUTUBE_TRACK_REGEX.exec(insert)) {
      const [, , id] = YOUTUBE_TRACK_REGEX.exec(insert);
      return id
    }

    if (YOUTUBE_PLAYLIST_REGEX.exec(insert)) {
      const [, , id] = YOUTUBE_PLAYLIST_REGEX.exec(insert);
      return id
    }
  }
}