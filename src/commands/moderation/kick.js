const { Command, ClientEmbed, Constants } = require('../../')

module.exports = class Kick extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'kick',
      category: 'moderation',
      aliases: ['kickar', 'expulsar'],
      utils: {
        requirements: {
          guildOnly: true,
          permissions: ['KICK_MEMBERS'],
          botPermissions: ['KICK_MEMBERS']
        },
        parameters: [
          {
            type: 'member',
            acceptBot: true,
            missingError: 'commands:kick.missingUser'
          },
          {
            type: 'string',
            required: false,
            full: true,
            missingError: 'commands:ban.missingReason'
          }
        ]
      }
    })
  }

  async run (
    { t, author, channel },
    member,
    reason = t('commons:texts.notDefined')
  ) {
    const embed = new ClientEmbed(author, { author: [this.client.user] })
    await member
      .kick(reason)
      .then(kickedMember => {
        embed
          .setThumbnail(member.user.displayAvatarURL)
          .setTitle(t('commands:kick.successTitle'))
          .setDescription(`${kickedMember} - \`${reason}\``)
      })
      .catch(err => {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:kick.cantKick'))
          .setDescription(`\`${err}\``)
      })
    channel.send(embed)
  }
}
