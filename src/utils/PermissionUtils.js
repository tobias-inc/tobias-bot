const Constants = require('./Constants.js')

module.exports = class PermissionUtils {
  static async isDeveloper (client, member) {
    // const botGuild = await client.guilds.resolve(Constants.BOT_GUILD)
    // console.log(member)
    const hasRole = await member.roles.cache.has(Constants.DEVELOPER_ROLE)
    // const developerRole = await botGuild.roles.fetch(Constants.DEVELOPER_ROLE)
    const isDeveloper = hasRole
    return isDeveloper
  }

  static async specialRole (client, user) {
    const botGuild = await client.guilds.resolve(Constants.BOT_GUILD)
    const member = await botGuild && botGuild.members.fetch(user.id)
    if (member) {
      return member.roles
        .filter(r => r.hoist)
        .sort((a, b) => b.position - a.position)
        .first()
    }
  }
}
