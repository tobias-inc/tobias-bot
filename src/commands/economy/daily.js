const { Command, ClientEmbed, Constants } = require("../../");

module.exports = class Daily extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'daily',
      category: 'economy',
      utils: {
        requirements: { databaseOnly: true }
      }
    })
  }

  async run({ t, author, channel }) {
    const embed = new ClientEmbed(author);

    try {
      const { collectedMoney } = await this.client.controllers.economy.bonus.claimDaily(author.id)
      embed.setDescription(t('commands:daily.claimedSuccessfully', { count: collectedMoney }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'ALREADY_CLAIMED':
          embed.setDescription(t('commands:daily.alreadyClaimedDescription', { time: e.formattedCooldown }))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed);
  }
}
