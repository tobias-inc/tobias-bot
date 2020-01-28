const { Command, ClientEmbed, Constants } = require("../../");

module.exports = class Ban extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'ban',
      category: 'moderation',
      aliases: ['banir'],
      utils: {
        requirements: {
          guildOnly: true, permissions: ['BAN_MEMBERS'], botPermissions: ['BAN_MEMBERS']
        },
        parameters: [{
          type: 'member', acceptBot: true, missingError: 'commands:ban.missingUser'
        }, {
          type: 'string', required: false, full: true, missingError: 'commands:ban.missingReason'
        }]
      }
    })
  }

  async run({ t, author, channel, guild }, member, reason = t('commons:texts.notDefined')) {
    const embed = new ClientEmbed(author, { author: [this.client.user] })
    await guild.ban(member, { days: 7, reason }).then(bannedMember => {
      embed
        .setThumbnail(member.user.displayAvatarURL)
        .setTitle(t('commands:ban.successTitle'))
        .setDescription(`${bannedMember} - \`${reason}\``)
    }).catch(err => {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:ban.cantBan'))
        .setDescription(`\`${err}\``)
    })

    channel.send(embed)
  }
}