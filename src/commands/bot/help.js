const { Command, ClientEmbed, Utils } = require("../../");

module.exports = class Help extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'help',
      category: 'bot',
      aliases: ['ajuda', 'h'],
      utils: {
        parameters: [{ type: 'command', required: false, getSubcommands: true, validCommands: true }]
      }
    })
  }

  async run({ t, channel, author, prefix, ...context }, command) {
    const { user: clientUser } = this.client
    const embed = new ClientEmbed(author)

    if (command) {
      const fullName = command.fullName
      const { subcommands, utils: { requirements: reqs } = {} } = command
      const aliases = command.aliases.length && command.aliases.map(a => `\`${a}\``).join(', ');

      const fields = [
        [t('commons:usage'), `**\`${command.usage(t, prefix, false, true)}\`**`],
        [t('commons:aliases'), `**${aliases || t('commons:none_a')}**`],
      ]

      if (reqs && reqs.permissions) {
        fields.push([
          t('commons:permissions'),
          reqs.permissions.map(p => `**\`${t(`permissions:${p}`)}\`**`).join(', ')
        ])
      }

      if (reqs && reqs.botPermissions) {
        fields.push([
          t('commons:botPermissions'),
          reqs.botPermissions.map(p => `**\`${t(`permissions:${p}`)}\`**`).join(', ')
        ])
      }

      if (subcommands.length) {
        const mainUsage = `${prefix}${this.name}`
        fields.push([
          t('commons:texts.subcommands'),
          [
            subcommands.map(s => `**\`${s.name}\`**`).join(', '),
            t('commands:help.subcommandKnowMore', {
              usage: `${mainUsage} ${fullName}`
            })
          ].join('\n')
        ])
      }

      fields.forEach(field => embed.addField(...field))
      channel.send(embed
        .setAuthor(fullName.split(' ').map(n => n.capitalize()).join(' - '))
        .setTitle(t([`commands:${command.tPath}.commandDescription`, 'commands:help.noDescriptionProvided']))
      )
    } else {
      this.fullHelp({ t, channel, author, prefix, clientUser, embed, ...context })
    }
  }

  fullHelp({ t, channel, prefix, clientUser, embed }) {
    const commands = this.client.commands
    const chosenCategory = commands
      .filter(c => !c.hidden || !(c.category === 'developer'))
      .map(c => c.category)
      .sort(() => Math.random() > 0.5 ? -1 : 1)[0];
    const someCommands = commands.filter(c => c.category === chosenCategory).slice(0, 10)

    const commandString = commands.find(c => c.name === 'commands').usage(t, prefix, false, true)
    const timeOnline = Utils.duration(
      this.client.uptime, { format: 'd[d] h[h] m[m] s[s]', stopTrim: 'm', trim: true }
    )

    channel.send(embed
      .setAuthor(t('client:clientUserHelp', { clientUser }), clientUser.displayAvatarURL)
      .setThumbnail(clientUser.displayAvatarURL)
      .setDescription([
        `**[${t('commons:utils.invite')}](${Utils.generateInvite(8, clientUser.id)})**`,
        `**[${t('commons:utils.website')}](${Utils.website})**`, '',
        `**${t('commons:texts.about')}**`,
        `${t('client:description')}`, '',
        `**${t('commons:utils.additional')}**`,
        `${t('client:viewCommandList')}:`, '',
        `**${chosenCategory.capitalize()}**: ${someCommands.map(cmd => `\`${cmd.name}\``).join(', ')}...`,
        `${t('commands:help.specificInformation', { helpString: this.usage(t, prefix, false, true) })}`, '',
        `${t('client:toKnowMoreHelp', { commandString })} ${Utils.websiteUrl('commands')}`, '',
        `**${t('client:aboutHelping')} ?**`, Utils.websiteUrl('donate'),
        `**${t('client:configureYourServer')}**`, Utils.websiteUrl('dashboard'), '',
        `${t('client:timeOnline')}: **${Utils.replaceTime(t, timeOnline)}**`
      ].join('\n'))
    )
  }
}