const { Command, ClientEmbed } = require('../../')

module.exports = class CommandChannel extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'commandchannel',
      category: 'configuration',
      aliases: ['command-channel', 'commandsch'],
      utils: {
        requirements: {
          guildOnly: true,
          databaseOnly: true,
          permissions: ['MANAGE_GUILD']
        }
      }
    })
  }

  run ({ t, author, channel, prefix }) {
    const client = this.client.user
    const embed = new ClientEmbed(author, {
      author: [client],
      thumbnail: client.displayAvatarURL
    })
    embed.setDescription(
      this.subcommands
        .map(subcmd => {
          const path = `commands:${subcmd.tPath}`
          return [t(`${path}.info`), subcmd.usage(t, prefix, false)].join('\n')
        })
        .join('\n\n')
    )
    channel.send(embed)
  }
}
