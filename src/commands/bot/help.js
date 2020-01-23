const { Command, ClientEmbed, Utils } = require("../../");

module.exports = class Help extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'help',
      category: 'bot',
      aliases: ['ajuda', 'h']
    })
  }

  async run({ t, channel, guild, aliase, author }) {
    const { uptime, user: clientUser } = this.client
    const embed = new ClientEmbed(author, { thumbnail: guild.iconURL || clientUser.displayAvatarURL })

    const commands = this.client.commands
    const chosenCategory = commands
      .filter(c => !(c.category === 'developer'))
      .map(c => c.category)
      .filter(c => !c.hidden)
      .sort(() => Math.random() > 0.5 ? -1 : 1)[0]
    const someCommands = commands.filter(c => c.category === chosenCategory).slice(0, 10)

    const timeOnline = Utils.duration(
      uptime, { format: 'd[d] h[h] m[m] s[s]', stopTrim: 'm', trim: true }
    )

    channel.send(embed
      .setAuthor(t('client:clientUserHelp', { clientUser }), clientUser.displayAvatarURL)
      .setDescription([
        `**[${t('commons:utils.invite')}](${Utils.generateInvite(8, clientUser.id)})**`,
        `**[${t('commons:utils.website')}](${Utils.website})**`, '',
        `**${t('commons:texts.about')}**`,
        t('client:description'), '',
        `**${t('commons:utils.additional')}**`,
        `${t('client:viewCommandList')}:`,
        `${someCommands.map(cmd => `\`${cmd.name}\``).join(', ')}...`,
        `${t('client:toKnowMoreHelp')} ${Utils.websiteUrl('commands')}`, '',
        `***${t('client:aboutHelping')} ?***`, Utils.websiteUrl('donate'),
        `***${t('client:configureYourServer')}***`, Utils.websiteUrl('dashboard'), '',
        `${t('client:timeOnline')}: **${Utils.replaceTime(t, timeOnline)}**`, ''
      ].join('\n'))
    )
  }
}