const { Command, ClientEmbed } = require('../../')

module.exports = class Money extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'money',
      category: 'economy',
      utils: {
        requirements: { databaseOnly: true },
        parameters: [
          {
            type: 'user',
            full: true,
            required: false
          }
        ]
      }
    })
  }

  async run ({ t, author, channel }, user = author) {
    const embed = new ClientEmbed(author)
    const balance = await this.client.controllers.economy.balance(user.id)

    channel.send(
      embed.setDescription(
        t('commands:money.userMoney', { user: user.tag, balance })
      )
    )
  }
}
