const { Command, ClientEmbed, Constants } = require("../../");

module.exports = class Rep extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'rep',
      category: 'social',
      utils: {
        requirements: { guildOnly: true, databaseOnly: true },
        parameters: [{
          type: 'user',
          full: true,
          required: true,
          acceptSelf: true,
          showUsage: false,
          missingError: 'errors:invalidUser'
        }]
      }
    })
  }

  async run({ t, author, channel }, user) {
    const embed = new ClientEmbed(author);

    try {
      const { reps } = await this.client.controllers.social.rep.donationRep(user.id);
      embed.setDescription(t('commands:rep.claimedSuccessfully', { tag: user.tag }))
    } catch (e) {
      console.log(e)
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'ALREADY_DONATE':
          embed.setDescription(t('commands:rep.alreadyDonateDescription', { time: e.formattedCooldown }))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed);
  }
}
