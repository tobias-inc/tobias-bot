const CommandError = require('./CommandError.js')
const PermissionUtils = require('../../utils/PermissionUtils.js')

module.exports = class CommandRequirements {
  static parseOptions (options = {}) {
    return {
      permissions: options.permissions,
      botPermissions: options.botPermissions,

      guildOnly: !!options.guildOnly,
      databaseOnly: !!options.databaseOnly,
      devOnly: !!options.devOnly,

      sameVoiceChannelOnly: !!options.sameVoiceChannelOnly,
      voiceChannelOnly: !!options.voiceChannelOnly,
      guildPlaying: !!options.guildPlaying,
      playerManagerOnly: !!options.guildPlaying || !!options.playerManagerOnly,

      canvasOnly: options.canvasOnly,
      apis: options.apis || [],
      envVars: options.envVars || [],

      errors: {
        databaseOnly: 'errors:databaseOnly',
        playerManagerOnly: 'errors:playerManagerOnly',
        devOnly: 'errors:developerOnly',
        guildOnly: 'errors:guildOnly',
        cooldown: 'errors:cooldown',
        sameVoiceChannelOnly: 'errors:sameVoiceChannelOnly',
        voiceChannelOnly: 'errors:voiceChannelOnly',
        guildPlaying: 'errors:notPlaying',
        api: {
          one: 'errors:apiOnlyOne',
          multiple: 'errors:apiOnlyOneMultiple'
        },
        ...(options.errors || {})
      }
    }
  }

  static handle (
    { t, author, channel, client, command, guild, voiceChannel, member, message },
    options
  ) {
    const opts = this.parseOptions(options)

    if (
      command.cooldownFeedback &&
      !PermissionUtils.isDeveloper(client, author)
    ) {
      if (command.cooldown.has(author.id)) {
        throw new CommandError(t(opts.errors.cooldown))
      }
    }

    if (opts.devOnly && !PermissionUtils.isDeveloper(client, message.member)) {
      throw new CommandError(t(opts.errors.devOnly))
    }

    if (opts.guildOnly && !guild) {
      throw new CommandError(t(opts.errors.guildOnly))
    }

    if (opts.databaseOnly && !client.database) {
      throw new CommandError(t(opts.errors.databaseOnly))
    }

    if (
      opts.playerManagerOnly &&
      !(client.playerManager && client.playerManager.isOnline(guild.region))
    ) {
      throw new CommandError(t(opts.errors.playerManagerOnly))
    }

    if (opts.apis && opts.apis.some(api => !client.apis[api])) {
      const count = opts.apis.filter(api => !client.apis[api]).length
      throw new CommandError(
        t(count > 1 ? opts.errors.api.multiple : opts.errors.api.one, { count })
      )
    }

    if (opts.permissions && opts.permissions.length > 0) {
      if (!channel.permissionsFor(member).has(opts.permissions)) {
        const permission = opts.permissions
          .map(p => t(`permissions:${p}`))
          .map(p => `**"${p}"**`)
          .join(', ')
        const sentence =
          opts.permissions.length >= 1
            ? 'errors:missingOnePermission'
            : 'errors:missingMultiplePermissions'
        throw new CommandError(t(sentence, { permission }))
      }
    }

    if (opts.botPermissions && opts.botPermissions.length > 0) {
      if (!channel.permissionsFor(guild.me).has(opts.permissions)) {
        const permission = opts.botPermissions
          .map(p => t(`permissions:${p}`))
          .map(p => `**"${p}"**`)
          .join(', ')
        const sentence =
          opts.botPermissions.length >= 1
            ? 'errors:botMissingOnePermission'
            : 'errors:botMissingMultiplePermissions'
        throw new CommandError(t(sentence, { permission }))
      }
    }

    const guildPlayer = client.playerManager && client.playerManager.get(guild.id)
    if (opts.guildPlaying && (!guildPlayer || !guildPlayer.playing)) {
      throw new CommandError(t(opts.errors.guildPlaying))
    }

    if (
      opts.sameVoiceChannelOnly &&
      guild.me.voiceChannelID &&
      (!voiceChannel || guild.me.voiceChannelID !== voiceChannel.id)
    ) {
      throw new CommandError(t(opts.errors.sameVoiceChannelOnly))
    }

    if (opts.voiceChannelOnly && !voiceChannel) {
      throw new CommandError(t(opts.errors.voiceChannelOnly))
    }
  }
}
