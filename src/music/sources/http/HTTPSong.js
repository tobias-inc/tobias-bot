const { Song } = require("../../structures");
const Constants = require("../../../utils/Constants.js");

module.exports = class HTTPSong extends Song {
  constructor(data = {}, requestedBy, Icecast) {
    super(data, requestedBy)
    this._Icecast = Icecast
    this.color = Constants.HTTP_COLOR
    this.source = 'http'
  }

  async loadInfo() {
    const radioInfo = await this._Icecast.fetchMetadata(this.uri).catch(() => null)
    if (radioInfo) {
      this.title = radioInfo['StreamTitle'] || 'Unknown Title'
      this.uri = radioInfo['StreamUrl'] || this.uri
    }
    return this
  }
}
