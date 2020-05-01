const { Listener } = require('../../')

module.exports = class GuildResponses extends Listener {
  constructor (client) {
    super(client)
    this.events = ['guildMemberAdd', 'guildMemberRemove']
  }

  async onGuildMemberAdd () {
    const guild = this.client.guilds.resolve('500452776770535444').members.cache.size.toString().split('')
    const contador = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    let count = ''
    for (let i = 0; i < guild.length; i++) { count += ':' + contador[guild[i]] + ':' }
    const canal = this.client.guilds.resolve('500452776770535444').channels.resolve('671400534535700512')
    canal.setTopic(`Temos atualmente ${count} TobiasMunistas`)
  }

  async onGuildMemberRemove () {
    const guild = this.client.guilds.resolve('500452776770535444').members.cache.size.toString().split('')
    const contador = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    let count = ''
    for (let i = 0; i < guild.length; i++) { count += ':' + contador[guild[i]] + ':' }
    const canal = this.client.guilds.resolve('500452776770535444').channels.resolve('671400534535700512')
    canal.setTopic(`Temos atualmente ${count} TobiasMunistas`)
  }
}
