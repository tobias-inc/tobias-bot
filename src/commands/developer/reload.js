const { Command, CommandError, ClientEmbed } = require("../../");

module.exports = class Reload extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'reload',
      category: 'developer',
      hidden: true,
      utils: {
        requirements: { devOnly: true },
        parameters: [{ type: 'command', missingError: 'commands:reload.noCommand' }]
      }
    })
  }

  async run({ channel, author, t }, command) {
    try {
      await command.reload()
      channel.send(new ClientEmbed(author).setTitle(t('commands:reload.sucess', { command: command.name })))
    } catch (e) {
      throw new CommandError(t('commands:reload.error', { error: e.message }))
    }
  }
}