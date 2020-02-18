const fetch = require('node-fetch')
const { Wrapper } = require('../')

const API_URL = 'https://hastebin.com'
const RAW_URL = 'https://hastebin.com/raw'

module.exports = class HastebinWrapper extends Wrapper {
  constructor () {
    super('hastebin')
  }

  createPaste (text) {
    return this.request('/documents', 'POST', text).then(({ key }) => {
      if (key) return `${RAW_URL}/${key}`
    })
  }

  request (endpoint, method = 'GET', body = {}) {
    return fetch(`${API_URL}${endpoint}`, { method, body }).then(res =>
      res.json()
    )
  }
}
