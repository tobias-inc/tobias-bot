const { Command } = require('../../')
const { MessageAttachment } = require('discord.js')

module.exports = class Avatar extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'avatar',
      category: 'utility',
      aliases: ['av', 'foto'],
      utils: {
        requirements: { databaseOnly: true, canvasOnly: true },
        parameters: [
          { type: 'user', fetchAll: true, required: false, acceptSelf: true }
        ]
      }
    })
  }

  async run ({ args, message, t, author, guild }, user = author) {
    const AVATAR = {
      type: false,
      buffer: false
    }

    if (user.displayAvatarURL() && user.displayAvatarURL().endsWith('.gif')) {
      AVATAR.buffer = user.displayAvatarURL()
      AVATAR.type = 'gif'
    } else if (user.displayAvatarURL()) {
      AVATAR.type = 'png'
      AVATAR.buffer = user.displayAvatarURL()
    }
    const attachment = new MessageAttachment(AVATAR.buffer, `${user.username}.${AVATAR.type}`)
    return message.channel.send(`\`${user.tag}\``, attachment)
  }
}
