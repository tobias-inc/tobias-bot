const { Command, ClientEmbed, Constants } = require('../../')

const TEXT_MAX_LENGTH = 86

module.exports = class PersonalText extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'personaltext',
      category: 'social',
      aliases: ['textopessoal', 'texto-pessoal', 'bio'],
      utils: {
        requirements: { databaseOnly: true },
        parameters: [
          {
            type: 'string',
            full: true,
            maxLength: TEXT_MAX_LENGTH,
            missingError: 'errors:invalidString'
          }
        ]
      }
    })
  }

  async run ({ t, author, channel }, text) {
    const embed = new ClientEmbed(author)
    try {
      await this.client.controllers.social.setPersonalText(author.id, text)
      embed
        .setTitle(t('commands:personaltext.updateSucessTitle'))
        .setDescription(text)
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR).setTitle(t('errors:generic'))
    }
    channel.send(embed)
  }
}
