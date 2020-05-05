const { Command, ClientEmbed, Constants } = require('../../../')

module.exports = class ConfigPrefix extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'language',
      category: 'configuration',
      referenceCommand: 'config'
    })
  }

  async run ({ t, author, channel, guild }, language = Constants.DEFAULT_LANGUAGE) {
    const embed = new ClientEmbed(author)
    try {
      await this.client.modules.language.updateValues(guild.id, { language })
      embed.setTitle(
        t('commands:config.subcommands.language.changedSuccessfully', { language })
      )
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR).setDescription(t('errors:generic'))
    }
    channel.send(embed)
  }
}
