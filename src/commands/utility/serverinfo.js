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

  async run ({ channel, language, t, author, guild }) {
    const embed = new ClientEmbed(author)

    channel.send(
      embed
        .addField(t('commands:serverinfo.name'), guild.name, true)
        .addField(
          t('commands:serverinfo.verify.ctx'),
          t(`commands:serverinfo.verify.level.${guild.verificationLevel}`),
          true
        )
        .addField(
          t('commands:serverinfo.createdAt'),
          await this.time(guild.createdAt, language),
          false
        )
        .addField(t('commands:serverinfo.owner'), guild.owner.user.tag, true)
        .addField(
          t('commands:serverinfo.channels.ctx', {
            length: Number(guild.channels.size).localeNumber(language)
          }),
          await this.channels(guild, t, language),
          true
        )
        .addField(
          t('commands:serverinfo.members.ctx', {
            size: Number(guild.memberCount).localeNumber(language)
          }),
          await this.members(guild, t, language),
          true
        )
        .addField(
          t('commands:serverinfo.role.ctx', {
            length: Number(guild.roles.size - 1).localeNumber(language)
          }),
          await this.roles(guild, t, language),
          false
        )
    )
  }

  channels (guild, t, lang) {
    const category = `**${Number(
      guild.channels.filter(c => c.type === 'category').size
    ).localeNumber(lang)}**`
    const voice = `**${Number(
      guild.channels.filter(c => c.type === 'voice').size
    ).localeNumber(lang)}**`
    const text = `**${Number(
      guild.channels.filter(c => c.type === 'text').size
    ).localeNumber(lang)}**`
    return [
      t('commands:serverinfo.channels.category') + category,
      t('commands:serverinfo.channels.text') + text,
      t('commands:serverinfo.channels.voice') + voice
    ].join('\n')
  }

  members (guild, t, lang) {
    const users = `**${Number(
      guild.memberCount - guild.members.filter(u => !u.user.bot).size
    ).localeNumber(lang)}**`
    const bots = `**${Number(
      guild.members.filter(u => u.user.bot).size
    ).localeNumber(lang)}**`
    return [
      t('commands:serverinfo.members.users') + users,
      t('commands:serverinfo.members.bots') + bots
    ].join('\n')
  }

  roles (guild, t, lang) {
    const roles = guild.roles.map(role => role).slice(1)
    const managed = guild.roles.filter(role => role.managed)
    if (!roles.length) return t('commands:serverinfo.role.noTags')
    return [
      t('commands:serverinfo.role.managed') +
        `**${Number(managed.size).localeNumber(lang)}**`,
      roles.length > 10
        ? roles
          .map(r => r)
          .slice(0, 10)
          .join(', ') +
          ` ${t('commands:serverinfo.role.tags', {
            length: roles.length - 10
          })}`
        : roles.map(r => r).join(', ')
    ].join('\n')
  }

  time (ms, language) {
    moment.locale(language)
    return moment(ms).format('LLLL')
  }
}
