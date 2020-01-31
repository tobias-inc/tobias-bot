const { Command } = require("../../");

module.exports = class Ping extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'ping',
      category: 'bot'
    })
  }

  run({ channel, instancedTimestamp }) {
    const now = Date.now()
    channel.send(
      `🏓 Pong! **${parseInt(now - instancedTimestamp)} ms** | API \`${Math.trunc(this.client.ping)}ms\``
    )
  }
}