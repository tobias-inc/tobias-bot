const moment = require('moment')
const { Command, ClientEmbed } = require('../../')

module.exports = class ServerInfo extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'serverinfo',
      category: 'utility',
      aliases: ['si', 'sinfo', 'serveri']
    })
  }

  async run ({ channel, t, author, message, guild }, user = author) {
    const embed = new ClientEmbed(author)
    const language = this.client.database.guilds.get(message.guild.id).language

    channel.send(

      embed

        .addField(t('commands:serverinfo.name'), guild.name, true)
        .addField(t('commands:serverinfo.verify.ctx'), t(`commands:serverinfo.verify.level.${guild.verificationLevel}`), true)
        .addField(t('commands:serverinfo.createdAt'), (await this.Time(guild.createdAt, language)), false)
        .addField(t('commands:serverinfo.owner'), guild.owner.user.tag, true)
        // .addField(t('commands:serverinfo.region'), this.client.regionsLang.replaces[guild.region], true)
        .addField(t('commands:serverinfo.channels.ctx', { length: Number(guild.channels.size).localeNumber(language) }), (await this.Channels(guild, t, language)), true)
        .addField(t('commands:serverinfo.members.ctx', { size: Number(guild.memberCount).localeNumber(language) }), (await this.Members(guild, t, language)), true)
        .addField(t('commands:serverinfo.role.ctx', { length: Number(guild.roles.size - 1).localeNumber(language) }), (await this.Roles(guild, t, language)), false)
    )
  }

  Channels (guild, t, lang) {
    const CATEGORY = (`**${Number(guild.channels.filter(c => c.type === 'category').size).localeNumber(lang)}**`)
    const VOICE = (`**${Number(guild.channels.filter(c => c.type === 'voice').size).localeNumber(lang)}**`)
    const TEXT = (`**${Number(guild.channels.filter(c => c.type === 'text').size).localeNumber(lang)}**`)
    return [
      t('commands:serverinfo.channels.category') + CATEGORY,
      t('commands:serverinfo.channels.text') + TEXT,
      t('commands:serverinfo.channels.voice') + VOICE
    ].join('\n')
  }

  Members (guild, t, lang) {
    const USERS = (`**${Number(guild.memberCount - guild.members.filter(u => u.user.bot).size).localeNumber(lang)}**`)
    const BOTS = (`**${Number(guild.members.filter(u => u.user.bot).size).localeNumber(lang)}**`)
    return [
      t('commands:serverinfo.members.users') + USERS,
      t('commands:serverinfo.members.bots') + BOTS
    ].join('\n')
  }

  Roles (guild, t, lang) {
    const ROLES = guild.roles.map(role => role).slice(1)
    const MANAGED = guild.roles.filter(role => role.managed)
    if (!ROLES.length) return t('commands:serverinfo.role.noTags')
    return [
      t('commands:serverinfo.role.managed') + `**${Number(MANAGED.size).localeNumber(lang)}**`,
      (ROLES.length > 10
        ? ROLES.map(r => r).slice(0, 10).join(', ') + ` ${t('commands:serverinfo.role.tags', { length: (ROLES.length - 10) })}`
        : ROLES.map(r => r).join(', ')
      )
    ].join('\n')
  }

  Time (ms, language) {
    moment.locale(language)
    return moment(ms).format('LLLL')
  }
}
