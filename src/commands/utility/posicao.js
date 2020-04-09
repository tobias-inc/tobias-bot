const { Command, ClientEmbed } = require('../../')

const msgTimeOut = async (msg, time) => {
  await new Promise(function (resolve, reject) {
    setTimeout(resolve, time)
  })
  return msg.clearReactions().catch(() => { })
}
// eslint-disable-next-line no-extend-native
Array.prototype.chunk = function (chunkSize) {
  var R = []
  for (var i = 0; i < this.length; i += chunkSize) { R.push(this.slice(i, i + chunkSize)) }
  return R
}

module.exports = class Posicao extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'posição',
      category: 'utility',
      aliases: ['pos', 'position'],
      utils: {}
    })
  }

  async run ({ channel, t, author, guild }) {
    const body = await guild.members.fetch().then(member => {
      return member.sort(function (a, b) {
        return a.joinedTimestamp - b.joinedTimestamp
      }).map(x => x.user.username)
    })
    const embed = new ClientEmbed(author)

    let inPage = 1
    const pages = body.chunk(10)

    channel.send(
      embed
        .setDescription(pages[0])
        .setFooter(t('commands:lyrics.footer', {
          page: 1,
          total: pages.length
        }), author.displayAvatarURL)
    )

    return channel.send(embed).then(async (msg) => {
      if (pages.length > 1) {
        await msg.react('◀️')
        await msg.react('▶️')
        const initializeCollector = (msg.createReactionCollector(
          (reaction, user) => ['♻', '◀️', '▶️'].includes(reaction.emoji.name) &&
                        user.id === author.id,
          { time: 120000 })
        )

        msgTimeOut(msg, 120000)
        return initializeCollector.on('collect', async (r) => {
          await r.remove(author.id).catch(() => { })
          if (r.emoji.name === '▶️') {
            if ((inPage + 1) === pages.length) {
              inPage = 0
              msg.edit(embed.setDescription(pages[inPage]).setFooter(t('commands:lyrics.footer', {
                page: (inPage + 1),
                total: pages.length
              }), author.displayAvatarURL))
            } else {
              inPage += 1
              msg.edit(embed.setDescription(pages[inPage]).setFooter(t('commands:lyrics.footer', {
                page: (inPage + 1),
                total: pages.length
              }), author.displayAvatarURL))
            }
          } else if (r.emoji.name === '◀️') {
            if ((inPage - 1) === pages.length) {
              inPage = 0
              msg.edit(embed.setDescription(pages[inPage]).setFooter(t('commands:lyrics.footer', {
                page: (inPage + 1),
                total: pages.length
              }), author.displayAvatarURL))
            } else {
              inPage -= 1
              msg.edit(embed.setDescription(pages[inPage]).setFooter(t('commands:lyrics.footer', {
                page: (inPage + 1),
                total: pages.length
              }), author.displayAvatarURL))
            }
          }
        })
      }
    })
  }
}
