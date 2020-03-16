const { Command, ClientEmbed } = require('../..')

module.exports = class DragRacing extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'dragracing',
      category: 'fun',
      aliases: ['race', 'corrida', 'arrancada'],
      utils: {
        requirements: { guildOnly: true },
        parameters: [{ type: 'user', missingError: 'commands:dragracing.noUser' }]
      }
    })
  }

  run ({ t, message, channel, author }, user) {
    var Açoes = ['**200**', '**500**', ' **800** ', ' **1000** ', ' **1500**', '**1800**']
    const corrida = Açoes[Math.round(Math.random() * Açoes.length)]
    const corrida2 = Açoes[Math.round(Math.random() * Açoes.length)]

    const embed = new ClientEmbed(author)

    let winner

    if (corrida < corrida2) { winner = message.author } else if (corrida > corrida2) { winner = user }

    if (corrida === corrida2) return channel.send(t('commands:dragracing.draw'))

    return channel.send(
      embed
        .setTitle(t('commands:dragracing.win', { ganhador: winner.username }))
        .setThumbnail(winner.displayAvatarURL || winner.avatarURL)
        .addField(t('commands:dragracing.challenger'), t('commands:dragracing.maked', { action: corrida, author: author }))
        .addField(t('commands:dragracing.challenged'), t('commands:dragracing.maked', { action: corrida2, author: user }))
    )
  }
}
