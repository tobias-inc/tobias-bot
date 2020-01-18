const { MusicPlayer, Listener } = require("../../");

module.exports = class WebSocketResponses extends Listener {
  constructor(client) {
    super(client)
    this.events = ['ready', 'error', 'debug']
  }

  onReady() {
    const nodes = [{
      "host": "localhost",
      "port": 3000,
      "password": "tobias-music",
      "region": "asia|eu|us|sam"
    }];

    this.client.playerManager = new MusicPlayer(this.client, nodes, {
      user: this.client.user.id,
      shards: 1
    })

    return this.client.user.setPresence({
      game: {
        name: `@${this.client.user.username} help`,
        type: 'PLAYING'
      },
      status: 'idle'
    })
  }

  onError(err) {
    console.log(err)
    process.exit(1)
  }

  onDebug(debug) {
    // this.client.console(false, debug, 'CLIENT', 'DEBUG')
  }
}