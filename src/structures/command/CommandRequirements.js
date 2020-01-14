const CommandError = require("./CommandError.js");
const PermissionUtils = require('../../utils/PermissionUtils.js');

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

module.exports = class CommandRequirements {
  static parseOptions(options = {}) {
    return {
      permissions: options.permissions,
      botPermissions: options.botPermissions,
      guildOnly: !!options.guildOnly,
      databaseOnly: !!options.databaseOnly,
      devOnly: !!options.devOnly,
      runescape: options.runescape,
      apis: options.apis || [],

      errors: {
        databaseOnly: 'errors:databaseOnly',
        runescapeOnly: 'errors:runescapeOnly',
        devOnly: 'errors:developerOnly',
        guildOnly: 'errors:guildOnly',
        cooldown: 'errors:cooldown',
        ...(options.errors || {})
      }
    }
  }

  static handle({ t, author, channel, client, command, guild, member }, options) {
    const opts = this.parseOptions(options)

    if (opts.databaseOnly && !client.database) {
      throw new CommandError(t(opts.errors.databaseOnly))
    }

    if (opts.devOnly && !PermissionUtils.isDeveloper(client, author)) {
      throw new CommandError(t(opts.errors.devOnly))
    }

    if (opts.guildOnly && !guild) {
      throw new CommandError(t(opts.errors.guildOnly))
    }

    if (opts.permissions && opts.permissions.length > 0) {
      if (!channel.permissionsFor(member).has(opts.permissions)) {
        const permission = opts.permissions.map(p => t(`permissions:${p}`)).map(p => `**"${p}"**`).join(', ')
        const sentence = opts.permissions.length >= 1 ? 'errors:missingOnePermission' : 'errors:missingMultiplePermissions'
        throw new CommandError(t(sentence, { permission }))
      }
    }

    if (opts.botPermissions && opts.botPermissions.length > 0) {
      if (!channel.permissionsFor(guild.me).has(opts.permissions)) {
        const permission = opts.botPermissions.map(p => t(`permissions:${p}`)).map(p => `**"${p}"**`).join(', ')
        const sentence = opts.botPermissions.length >= 1 ? 'errors:botMissingOnePermission' : 'errors:botMissingMultiplePermissions'
        throw new CommandError(t(sentence, { permission }))
      }
    }

    if (opts.runescape) {
      if (!client.runescape) throw new CommandError(t(opts.errors.runescapeOnly))
      if (opts.runescape.apis && !(client.runescape.getApi(opts.runescape.apis))) {
        const apis = client.runescape.getApi(opts.runescape.apis, true).map(api => `**"${api}"**`)
        const sentence = apis.length >= 1 ? 'errors:missingOneRuneScapeApi' : 'errors:missinMultipleRuneScapeApi'
        throw new CommandError(t(sentence, { apis: apis.join(', ') }))
      }

      const parseMethods = { rs: client.runescape.rs.viewMethods, osrs: client.runescape.osrs.viewMethods }
      if (
        opts.runescape.methods &&
        opts.runescape.methods
          .map(method => parseMethods[method.api][method.type])
          .filter(v => !v).length
      ) {
        const methods = opts.runescape.methods
          .map(method => parseMethods[method.api][method.type] ? false : method)
          .filter(v => v)
          .map(m => `**"${m.api.toUpperCase()}:${capitalize(m.method)}"**`)
        const sentence = methods.length >= 1 ? 'errors:missingOneRuneScapeMethod' : 'errors:missinMultipleRuneScapeMethod'
        throw new CommandError(t(sentence, { apis: apis.join(', ') }))
      }
    }

    if (command.cooldownFeedback) {
      if (command.cooldown.has(author.id)) {
        throw new CommandError(t(opts.errors.cooldown))
      }
    }
  }
}