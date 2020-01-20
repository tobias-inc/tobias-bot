const { Song } = require("../../structures");
const Constants = require("../../../utils/Constants.js");

module.exports = class YoutubeSong extends Song {
  constructor(data = {}, requestedBy) {
    super(data, requestedBy)
    this.color = Constants.YOUTUBE_COLOR
  }
}