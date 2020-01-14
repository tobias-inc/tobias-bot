const { Command } = require("../../");

module.exports = class Ping extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'ping',
      category: 'bot',
      aliases: ['pong']
    })
  }

  run({ channel, message: { createdTimestamp } }) {
    return channel.send('\`❔\`').then(m => {
      m.edit(`🏓 Pong! **${parseInt(m.createdTimestamp - createdTimestamp)} ms**`)
    })
  }
}