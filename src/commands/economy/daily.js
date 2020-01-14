const { Command, ClientEmbed } = require("../../");

module.exports = class Daily extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'daily',
      category: 'economy',
      utils: {
        requirements: { databaseOnly: true }
      }
    })
  }

  run({ t, author, channel }) {
    
  }
}
