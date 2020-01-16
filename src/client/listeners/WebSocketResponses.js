const { CommandContext, Listener } = require("../../");

module.exports = class WebSocketResponses extends Listener {
  constructor(client) {
    super(client)
    this.events = ['ready', 'error', 'debug']
  }

  onReady() {
    return this.client.user.setPresence({
      game: {
        name: `@${this.client.user.username} help`,
        type: 'PLAYING'
      },
      status: 'dnd'
    })
  }

  onError(err) {
    this.client.console(true, (err.error || err), 'WebSocket Error')
    process.exit(1)
  }

  onDebug(debug) {
    this.client.console(false, debug, 'CLIENT', 'DEBUG')
  }
}