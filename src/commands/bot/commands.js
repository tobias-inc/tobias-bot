const { Command, ClientEmbed } = require('../../')

module.exports = class Commands extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'commands',
      category: 'bot',
      aliases: ['comandos']
    })
  }

  run ({ t, channel, author }) {
    const embed = new ClientEmbed(author, {
      thumbnail: this.client.user.displayAvatarURL
    })

    const validCommands = this.client.commands.filter(c => !c.hidden)
    const categories = validCommands
      .map(c => c.category)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => t(`categories:${a}`).localeCompare(t(`categories:${b}`)))
      .map(category => {
        const commands = validCommands
          .filter(c => c.category === category)
          .sort((a, b) => a.name.localeCompare(b.name))
        return { commands, category }
      })

    channel.send(
      embed
        .setTitle(
          t('commands:commands.commandsTitle', { count: validCommands.length })
        )
        .setDescription(
          categories
            .map(({ commands, category }) =>
              [
                `${t(`categories:${category}`)} **(${commands.length})**`,
                commands.map(c => `\`${c.name}\``).join('**, **')
              ].join('\n')
            )
            .join('\n\n')
        )
    )
  }
}
