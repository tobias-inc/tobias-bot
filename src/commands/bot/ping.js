const { Command } = require("../../");

module.exports = class Ping extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'ping',
      category: 'bot'
    })
  }

  run({ channel }) {
    return channel.send('\`❔\`').then(m => {
      m.edit(`🏓 Pong! **${parseInt(Date.now() - m.createdTimestamp)} ms** | API \`${this.client.ping}ms\``)
    })
  }
}