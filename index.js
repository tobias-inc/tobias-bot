if (process.env.NODE_ENV !== 'development') require('dotenv').config()

try {
  require("./src/utils/canvas/CanvasUtils.js").initializeHelpers()
} catch (e) {
  console.log(e)
  clientConfig.canvasLoaded = false
}

const clientConfig = {
  canvasLoaded: true,
  disabledEvents: ["TYPING_START", "TYPING_STOP", "USER_NOTE_UPDATE"],
  disableEveryone: true,
  restTimeOffset: 2000,
  retryLimit: 20,
  messageCacheMaxSize: 2024,
  messageCacheLifetime: 1680,
  messageSweepInterval: 1680,
}

const client = require('./src/TobiasClient.js');

module.exports = new client(clientConfig).login()