const { Command } = require("../../");

const matches = ['@here', '@everyone'];

module.exports = class Say extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'say',
      category: 'bot',
      utils: {
        requirements: { guildOnly: true, permissions: ['MANAGE_GUILD'] },
        parameters: [{
          type: 'string', full: true, missingError: 'errors:invalidString', showUsage: true
        }]
      }
    })
  }

  run({ channel }, expr) {
    return channel.send(this.replaceString(expr));
  }

  replaceString(char) {
    matches.forEach(
      match => char = char.replace(new RegExp(match, 'gi'), (m) => m.split('@').map(m => `@ ${m}`).join(''))
    )
    return char
  }
}