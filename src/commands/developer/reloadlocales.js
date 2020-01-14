const { Command, CommandError, ClientEmbed } = require("../../");

module.exports = class ReloadLocales extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'reloadlocales',
      category: 'developer',
      aliases: ['reloadl', 'locales', 'rlc'],
      hidden: true,
      utils: {
        requirements: { devOnly: true }
      }
    })
  }

  async run({ channel, author, t }) {
    try {
      await this.client.language.reset();
      channel.send(new ClientEmbed(author).setTitle(t('commands:reloadlocales.sucess')))
    } catch (e) {
      throw new CommandError(t('commands:reloadlocales.error', { error: e.message }))
    }
  }
}