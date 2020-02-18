require('dotenv/config')

require('moment')
require('moment-duration-format')

let canvasLoaded = false
try {
  require('canvas')
  require('./src/utils/canvas/CanvasUtils.js').initializeHelpers()
  canvasLoaded = true
} catch (e) {
  console.log(e)
}

const CLIENT_OPTIONS = {
  disabledEvents: ['TYPING_START', 'TYPING_STOP', 'USER_NOTE_UPDATE'],
  disableEveryone: true,
  fetchAllMembers: true,
  autoReconnect: true,
  restTimeOffset: 2000,
  retryLimit: 20,
  messageCacheMaxSize: 2024,
  messageCacheLifetime: 1680,
  messageSweepInterval: 1680,
  canvasLoaded
}

const tobias = require('./src/TobiasClient.js')
const client = new tobias(CLIENT_OPTIONS)
client
  .login()
  .then(() =>
    client.console(false, 'I successfully connected!', 'LOGIN', 'DISCORD API')
  )
