const { Command, CommandError, ClientEmbed, Constants, Utils } = require("../../");

const URL_REGEX = /^(https|http):\/\/[^\s$.?#].[^\s]*$/gm

module.exports = class BugReport extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'bugreport',
      category: 'bot',
      utils: {
        requirements: { apis: ['hastebin'] },
        parameters: [{
          type: 'string', full: true, missingError: 'commands:bugreport:invalidString'
        }, [{
          type: 'stringFlag', name: 'screenshots', aliases: ['screenshot']
        }]]
      }
    })
  }

  async run({ t, flags, author, channel, guild }, bugReported) {
    const embed = new ClientEmbed(author);

    try {
      const screenShotsFlag = flags['screenshots']
      const screenShots = screenShotsFlag && screenShotsFlag.split(' ').filter(s => URL_REGEX.test(s));
      const PASTE_URL = await this.client.apis.hastebin.createPaste([
        ['Author:', author.tag].join('\n'),
        ['Bug:', bugReported].join('\n'),
        ['Screenshots:', screenShots ? screenShots.join('\n') : 'None'].join('\n'),
        ['Date', new Date().toLocaleDateString()].join('\n')
      ].join('\n\n'))

      if (screenShots) embed.addField(t('commands:bugreport.screenshots'), screenShots.join('\n'))
      embed.setTitle(t('commands:bugreport.view')).setURL(PASTE_URL).setDescription(bugReported)
    } catch (e) {
      throw new CommandError(t('errors:generic'))
    }

    channel.send(embed).then(() => {
      Utils.guildSend(
        embed.setThumbnail(author.displayAvatarURL).addField('Guild', guild ? guild.id : 'None'),
        Constants.Channels.BUG_REPORT,
        { client: this.client }
      )
    })
  }
}