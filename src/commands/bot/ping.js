const { Command } = require("../../");

module.exports = class Ping extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'ping',
      category: 'bot'
    })
  }

  run({ channel }) {
    const now = Date.now()
    return channel.send('\`❔\`').then(m => {
      const sendNow = Date.now()
      m.edit(`🏓 Pong! **${parseInt(sendNow - now)} ms** | API \`${Math.trunc(this.client.ping)}ms\``)
    })
  }
}