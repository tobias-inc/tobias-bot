const fetch = require("node-fetch");
const { Wrapper } = require("../");

const API_URL = 'https://pastebin.com/api';
const RAW_URL = 'https://pastebin.com/raw';

const PASTEBIN_URL_REGEX = /https:\/\/pastebin.com\/([a-zA-Z0-9]{8})/

module.exports = class PastebinWrapper extends Wrapper {
  constructor() {
    super('pastebin')
    this.envVars = ['PASTEBIN_DEV_KEY']
  }

  createPaste(text, { title = 'DefaultPaste', expireAt = 'N', format = 'text', privacy = '0' } = {}) {
    const queryParams = {
      'api_paste_expire_date': expireAt,
      'api_option': 'paste',
      'api_paste_code': text,
      'api_paste_private': privacy,
      'api_paste_name': title,
      'api_paste_format': format
    }

    return this.request('/api_post.php', 'POST', queryParams).then(async res => {
      const url = await res.text()
      if (PASTEBIN_URL_REGEX.test(url)) {
        const [, id] = PASTEBIN_URL_REGEX.exec(url)
        return `${RAW_URL}/${id}`
      }
      return url
    })
  }

  request(endpoint, method = 'GET', queryParams = {}) {
    const qParams = new URLSearchParams({ 'api_dev_key': process.env.PASTEBIN_DEV_KEY, ...queryParams })
    return fetch(`${API_URL}${endpoint}`, {
      method,
      body: qParams
    })
  }
}
