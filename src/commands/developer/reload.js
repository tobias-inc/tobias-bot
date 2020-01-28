const { Command, ClientEmbed, Constants } = require("../../");

module.exports = class Reload extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'reload',
      category: 'developer',
      hidden: true,
      utils: {
        requirements: { devOnly: true },
        parameters: [{ type: 'command', missingError: 'commands:reload.missingCommand' }]
      }
    })
  }

  async run({ channel, author, t }, command) {
    const embed = new ClientEmbed(author)
    try {
      await command.reload()
      embed.setTitle(t('commands:reload.sucess', { commandName: command.name }))
    } catch (e) {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:reload.error'))
        .setDescription(`\`${e.message || e.stack || e}\``)
    }
    channel.send(embed)
  }
}