const { Command, ClientEmbed, Constants } = require("../../");

module.exports = class Hug extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'hug',
      category: 'fun',
      aliases: ['abraçar'],
      utils: {
        requirements: { apis: ['nekos'] }
      }
    })
  }

  async run({ t, author, channel }) {
    const hugImageUrl = await this.client.apis.nekos.getImage('hug');
  }
}
