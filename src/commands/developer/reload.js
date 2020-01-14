const { Command, CommandError, ClientEmbed } = require("../../");

module.exports = class Reload extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'reload',
      category: 'developer',
      aliases: ['r'],
      hidden: true,
      utils: {
        requirements: { devOnly: true },
        parameters: [{
          type: 'string',
          full: true,
          whitelist: (arg) => this.client.commands.find(({ name, aliases }) => (name === arg.toLowerCase()) || aliases.includes(arg.toLowerCase())),
          missingError: ({ t, author }) => {
            return new ClientEmbed(author).setTitle(t('commands:reload.noCommand'))
          }
        }]
      }
    })
  }

  async run({ channel, author, t }, cmd) {
    try {
      const command = this.client.commands.find(({ name, aliases }) => (name === cmd.toLowerCase()) || aliases.includes(cmd.toLowerCase()));
      await command.reload()
      channel.send(new ClientEmbed(author).setTitle(t('commands:reload.sucess', { command: command.name })))
    } catch (e) {
      throw new CommandError(t('commands:reload.error', { error: e.message }))
    }
  }
}