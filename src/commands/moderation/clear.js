const { Command } = require('../../')

const CLEAR_MAX_LENGHT = 100
const CLEAR_MIN_LENGHT = 2

module.exports = class Clear extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'clear',
      category: 'moderation',
      aliases: ['apagar', 'dell', 'delete'],
      utils: {
        requirements: {
          guildOnly: true,
          permissions: ['MANAGE_MESSAGES'],
          botPermissions: ['MANAGE_MESSAGES']
        },
        parameters: [
          {
            type: 'number',
            full: true,
            maxLength: CLEAR_MAX_LENGHT,
            minLenght: CLEAR_MIN_LENGHT,
            missingError: 'errors:invalidNumber'
          }
        ]
      }
    })
  }

  async run ({ t, message, channel, author }) {
    const parts = message.content.split(' ')
    const toDeleteCount = parseInt(parts[1])

    channel.bulkDelete(toDeleteCount + 1, true)
    channel.send(`${t('commands:cleared', { USER: author.tag, COUNT: toDeleteCount })}`).then(message => {
      setTimeout(() => { message.delete() }, 5000)
    })
  }
}
