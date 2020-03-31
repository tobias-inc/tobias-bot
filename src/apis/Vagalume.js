const fetch = require('node-fetch')
const { Wrapper } = require('../')

const API_URL = 'https://api.vagalume.com.br'

const generateArtistSerch = artist =>
  `https://www.vagalume.com.br/${artist}/index.js`

module.exports = class GeniusWrapper extends Wrapper {
  constructor () {
    super('vagalume')
  }

  getLyric (songName) {
    return this.request('/search.artmus')
  }

  getArtist (artist) {
    return fetch(generateArtistSerch(artist)).then(res => res.json())
  }

  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    return fetch(`${API_URL}${endpoint}?${qParams.toString()}`).then(res =>
      res.json()
    )
  }
}
