const AsciiTable = require('ascii-table')
const { Command } = require('../../')

const localeNumber = (n, l) => Number(n).localeNumber(l)

module.exports = class Rank extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'rank',
      category: 'social',
      utils: {
        requirements: { databaseOnly: true },
        parameters: [{ type: 'user', required: false, acceptSelf: true }]
      }
    })
  }

  async run ({ t, author, channel, language }, user = author) {
    const table = new AsciiTable(t('commands:rank.tableTitle')).setHeading(
      t('economy:texts.rank'),
      t('economy:texts.user'),
      t('economy:texts.level'),
      t('economy:texts.xp')
    )

    const {
      inRank,
      usersSorted
    } = await this.client.controllers.social.getRank(user.id, true)
    const rankUsers = usersSorted
      .map(u => {
        const user = this.client.users.get(u._id)
        if (!user) return
        return { tag: `${user.username}#${user.discriminator}`, ...u.economy }
      })
      .filter(u => !!u)
      .slice(0, 10)

    rankUsers.concat([{}, {}, {}]).forEach((u, i) => {
      const level = localeNumber(u.level, language)
      const xp = localeNumber(u.xp, language)
      const params = isNaN(level) || isNaN(xp) ? [] : [i + 1, u.tag, level, xp]
      table.addRow(...params)
    })

    const {
      economy: userDocument
    } = await this.client.controllers.social.retrieveProfile(user.id, 'economy')
    const getTable = table
      .addRow(
        inRank,
        user.tag,
        localeNumber(userDocument.level, language),
        localeNumber(userDocument.xp, language)
      )
      .toString()
    channel.send(`\`\`\`${getTable}\`\`\``)
  }
}
