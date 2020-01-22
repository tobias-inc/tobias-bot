const { Command } = require("../../");

module.exports = class Help extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'help',
      category: 'bot',
      aliases: ['ajuda', 'h']
    })
  }

  async run({ channel }) {
    channel.send('OHA')
  }
}