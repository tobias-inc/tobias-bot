const { Command, ClientEmbed } = require('../../')

const msgTimeOut = async (msg, time) => {
  await new Promise(function (resolve, reject) {
    setTimeout(resolve, time)
  })
  return msg.reactions.removeAll().catch(() => { })
}

module.exports = class Lyrics extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'lyrics',
      category: 'music',
      aliases: ['letra'],
      utils: {
        requirements: {
          guildOnly: true
        }
      }
    })
  }

  async run ({ channel, author, t, args }) {
    const embed = new ClientEmbed(author)

    const search = args[0] ? args.join(' ')
      : author.presence.game &&
      author.presence.game.name === 'Spotify' && `${author.presence.game.details} - ${author.presence.game.state.split(';')[0]}`

    if (search) {
      const { hits: [hit] } = await this.client.apis.GeniusApi.findTrack(search)

      if (hit) {
        const { thumbnailUrl, title, artist, id, path } = hit

        let inPage = 0
        const body = this.splitLyric(await this.client.apis.GeniusApi.loadLyrics(id));

        (embed
          .setTitle(`${title} - ${artist}`)
          .setURL(`http://genius.com${path}`)
          .setThumbnail(thumbnailUrl)
          .setDescription(body[0])
          .setFooter(t('commands:lyrics.footer', {
            page: 1,
            total: body.length
          }), author.displayAvatarURL)
        )

        return channel.send(embed).then(async (msg) => {
          if (body.length > 1) {
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
              if (r.emoji.id === '▶️') {
                if ((inPage + 1) === body.length) {
                  inPage = 0
                  msg.edit(embed.setDescription(body[inPage]).setFooter(t('commands:lyrics.footer', {
                    page: (inPage + 1),
                    total: body.length
                  }), author.displayAvatarURL))
                } else {
                  inPage += 1
                  msg.edit(embed.setDescription(body[inPage]).setFooter(t('commands:lyrics.footer', {
                    page: (inPage + 1),
                    total: body.length
                  }), author.displayAvatarURL))
                }
              } else if (r.emoji.id === '◀️') {
                if ((inPage - 1) === body.length) {
                  inPage = 0
                  msg.edit(embed.setDescription(body[inPage]).setFooter(t('commands:lyrics.footer', {
                    page: (inPage + 1),
                    total: body.length
                  }), author.displayAvatarURL))
                } else {
                  inPage -= 1
                  msg.edit(embed.setDescription(body[inPage]).setFooter(t('commands:lyrics.footer', {
                    page: (inPage + 1),
                    total: body.length
                  }), author.displayAvatarURL))
                }
              } else if (r.emoji.name === '♻') {
                inPage = 0
                msg.edit(embed.setDescription(body[inPage]).setFooter(t('commands:lyrics.footer', {
                  page: (inPage + 1),
                  total: body.length
                }), author.displayAvatarURL))
              }

              if (inPage === 0) {
                msg.reactions.get('♻') &&
                  msg.reactions.get('♻')
                    .remove(msg.reactions.get('♻').users.last().id).catch(() => { })
              } else if (inPage === 1) msg.react('♻')
            })
          }
        })
      } else {
        return channel.send(embed
          .setDescription(`❌ **${author.username}**, ${t('commands:lyrics:noSong')}`)
          .setColor(process.env.ERROR_COLOR)
        )
      }
    } else {
      return channel.send(embed
        .setDescription(`❌ **${author.username}**, ${t('commands:lyrics:noSong')}`)
        .setColor(process.env.ERROR_COLOR)
      )
    }
  }

  splitLyric (str) {
    return str.match(/(.|[\r\n]){1,500}/g)
  }
}
