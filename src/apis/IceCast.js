const IcecastParser = require("icecast-parser");
const { Wrapper } = require("../");

module.exports = class IceCastWrapper extends Wrapper {
  constructor() {
    super('icecast')
  }

  fetchMetadata(url) {
    return new Promise((resolve, reject) => {
      if (url.startsWith('https://')) return reject(new Error('HTTPS'))
      try {
        const station = new IcecastParser(url)
        station.on('metadata', resolve)
        station.on('error', reject)
        station.on('empty', reject)
      } catch (e) {
        reject(e)
      }
    })
  }
}