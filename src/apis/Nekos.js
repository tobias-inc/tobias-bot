const fetch = require('node-fetch')
const { Wrapper } = require('../')

const API_URL = 'https://nekos.life/api/v2'

module.exports = class NekosWrapper extends Wrapper {
  constructor () {
    super('nekos')
  }

  getImage (type = 'hug') {
    return this.request(`/img/${type}`).then(res => res.url)
  }

  request (endpoint) {
    return fetch(`${API_URL}${endpoint}`).then(res => res.json())
  }
}
