const { Command, ClientEmbed, Constants } = require("../../../");

const PREFIX_MAX_LENGTH = 5;

module.exports = class ConfigPrefix extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'prefix',
      category: 'configuration',
      referenceCommand: 'config',
      utils: {
        parameters: [{
          type: 'string',
          full: true,
          required: false,
          maxLength: PREFIX_MAX_LENGTH,
          missingError: 'commands:config.subcommands.prefix.missingPrefix'
        }]
      }
    })
  }

  async run({ t, author, channel, guild }, prefix = Constants.DEFAULT_PREFIX) {
    const embed = new ClientEmbed(author)
    try {
      await this.client.modules.prefix.updateValues(guild.id, { prefix })
      embed.setTitle(t('commands:config.subcommands.prefix.changedSuccessfully', { prefix }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR).setDescription(t('errors:generic'))
    }
    channel.send(embed)
  }
}