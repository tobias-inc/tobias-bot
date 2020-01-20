const Constants = require("./Constants.js");

module.exports = class PermissionUtils {
  static isDeveloper(client, user) {
    const botGuild = client.guilds.get(Constants.BOT_GUILD)
    const developerRole = botGuild && botGuild.roles.get(Constants.DEVELOPER_ROLE)
    const isDeveloper = (developerRole && developerRole.members.has(user.id)) || (Constants.DEVELOPER_USERS && Constants.DEVELOPER_USERS.split(',').includes(user.id))
    return isDeveloper
  }

  static specialRole(client, user) {
    const botGuild = client.guilds.get(Constants.BOT_GUILD)
    const member = botGuild && botGuild.members.get(user.id)
    if (member) {
      return member.roles.filter(r => r.hoist).sort((a, b) => b.position - a.position).first()
    }
  }
}