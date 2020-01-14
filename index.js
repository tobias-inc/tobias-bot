const client = require('./src/TobiasClient.js');

const clientConfig = {
  clientConfig: true
}

try {
  require("./src/utils/canvas/CanvasUtils.js").initializeHelpers()
} catch (e) {
  console.log(e)
  clientConfig.canvasLoaded = false
}

module.exports = new client(clientConfig).login()