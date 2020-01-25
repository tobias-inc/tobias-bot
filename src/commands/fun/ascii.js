const figlet = require("figlet");
const { Command, CommandError } = require("../../");

const ASCII_LENGTH = 20;

module.exports = class Ascii extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'ascii',
      category: 'fun',
      utils: {
        parameters: [{
          type: 'string',
          full: true,
          maxLength: ASCII_LENGTH,
          missingError: 'errors:invalidString'
        }]
      }
    })
  }

  run({ t, channel }, ascii) {
    figlet(ascii, (err, data) => {
      if (err) throw new CommandError(t('commands:ascii.emitedError', { error: err.name || err }))
      channel.send(`\`\`\`${data}\`\`\``)
    })
  }
}
