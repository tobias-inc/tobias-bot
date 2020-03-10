const moment = require('moment')
const { Command, ClientEmbed } = require('../../')

const msgTimeOut = async (msg, time) => {
  await new Promise(function (resolve, reject) {
    setTimeout(resolve, time)
  })
  return msg.clearReactions().catch(() => { })
}
module.exports = class UserInfo extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'userinfo',
      category: 'utility',
      aliases: ['ui', 'uinfo', 'useri'],
      utils: {
        parameters: [
          { type: 'user', fetchAll: true, required: false, acceptSelf: true, missingError: 'errors:invalidUser' }
        ]
      }
    })
  }

  async run ({ channel, t, author, message, guild }, user = author) {
    const embed = new ClientEmbed(author)
    let Status
    const language = this.client.database.guilds.get(message.guild.id).language

    if (user.presence.status === 'online') Status = '<:b_online:438399398808911882> '
    if (user.presence.status === 'dnd') Status = '<:b_dnd:438399396548313091> '
    if (user.presence.status === 'idle') Status = '<:b_idle:438399398796460032> '
    if (user.presence.status === 'offline') Status = '<:b_offline:438399398762905600> '
    if (user.presence.status === 'streaming') Status = '<:b_stream:438399396963418131> '

    channel.send(
      embed
        .addField(t('commands:userinfo.name'), user.tag, true)
        .addField(t('commands:userinfo.nickname.ctx'), user.nickname ? user.nickname : t('commands:userinfo.nickname.none'), true)
        .addField(t('commands:userinfo.id'), user.id, false)
        .addField(t('commands:userinfo.createdAt'), (await this.Time(user.createdAt, language)), false)
        .addField(t('commands:userinfo.joinedAt'), (await this.Time(guild.member(user.id).joinedAt, language)), false)
        .addField(t('commands:userinfo.status.ctx'), Status + t(`commands:userinfo.status.${user.presence.status}`), true)
        .addField(t('commands:userinfo.bot.ctx'), t(`commands:userinfo.bot.${user.bot}`), true)
        .addField(t('commands:userinfo.role.ctx', { size: Number((guild.member(user.id).roles.size - 1)).localeNumber(language) }), (await this.Roles(user, guild, t, language)), false)
    ).then((msg) => {
      msg.react('▶️')
      return ((N = 0) => {
        const initializeCollector = msg.createReactionCollector((reaction, user) => (
          (reaction.emoji.name === '◀️' || reaction.emoji.name === '▶️') && (
            user.id === author.id
          )), { time: 120000 })

        msgTimeOut(msg, 120000)
        return initializeCollector.on('collect', async (r) => {
          if (guild && channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) await msg.clearReactions()
          else r.remove(this.client.user.id)

          // eslint-disable-next-line eqeqeq
          if (N == 0) {
            this.newEmbed(msg, user, author, channel, t).catch(() => { })
            msg.react('◀️')
          } else {
            msg.edit(embed).catch(() => { })
            msg.react('▶️')
          }

          // eslint-disable-next-line no-return-assign
          return (N === 1 ? N = 0 : N = 1)
        }).catch(async () => {
          if (guild && channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) await msg.clearReactions()
          else msg.user.reaction.remove(this.client.user.id)

          msg.edit(embed.setColor(process.env.ERROR_COLOR))
          return initializeCollector.stop()
        })
      })()
    }).catch(() => { })
  }

  Roles (user, guild, t, lang) {
    const ROLES = guild.member(user.id).roles.map(role => role).slice(1)
    if (!ROLES.length) return t('commands:userinfo.role.none')
    return [
      (ROLES.length > 10
        ? ROLES.map(r => r).slice(0, 10).join(', ') + ` ${t('commands:userinfo.role.and'
          , {
            size: Number(ROLES.length - 10).localeNumber(lang)
          })}`
        : ROLES.map(r => r).join(', ')
      )
    ]
  }

  newEmbed (msg, user, author, channel, t, { displayAvatarURL } = this.client.user) {
    return msg.edit(new ClientEmbed(author)
      .setAuthor(this.client.user.username, displayAvatarURL)
      .setThumbnail(user.avatarURL ? user.avatarURL : displayAvatarURL)
      .addField(t('commands:userinfo.permissions'), (channel.permissionsFor(user.id).toArray().map(perm => `\`${perm}\``).join(', ')))
    )
  }

  Time (ms, language) {
    moment.locale(language)
    return moment(ms).format('LLLL')
  }
}
