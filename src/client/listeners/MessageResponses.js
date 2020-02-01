const SocialUtils = require("../utils/SocialUtils.js");
const { CommandContext, Listener } = require("../../");

const getPrefix = (m, p) => p.find(pr => m.content.startsWith(pr));

module.exports = class MessageResponses extends Listener {
  constructor(client) {
    super(client)
    this.events = ['message', 'messageUpdate', 'voiceStateUpdate']

    this.socialUtils = new SocialUtils(client);
  }

  get commands() {
    return this.client.commands
  }

  get modules() {
    return this.client.modules
  }

  onMessageUpdate(oldM, newM) {
    if (oldM.author.bot) return
    if (newM.edits.length <= 2) {
      const inGuild = !!newM.channel.guild
      if (!inGuild) return
      if ((oldM.content !== newM.content) && newM.content.length) {
        this.client.emit('message', newM, true);
      }
    }
  }

  async onMessage(message, emited) {
    if (message.author.bot) return;

    const now = Date.now()
    const guildId = message.guild && message.guild.id;

    const { prefix, spacePrefix } = await this.modules.prefix.retrieveValues(guildId, ['prefix', 'spacePrefix']);
    const language = await this.modules.language.retrieveValue(guildId, 'language');
    const usedPrefix = getPrefix(message, [prefix, `<@!${this.client.user.id}>`, `<@${this.client.user.id}>`]);

    const commandsChannel = await this.modules.commands
      .retrieveValue(guildId, 'commandsChannel')
      .then(g => g.filter(c => message.guild.channels.has(c.channelId)).map(c => c.channelId));

    if (usedPrefix && (message.content.length > usedPrefix.length)) {
      const fullCmd = message.content.substring(usedPrefix.length).split(/[ \t]+/).filter(a => !spacePrefix || a)
      const args = fullCmd.slice(1);

      const aliase = fullCmd[0].toLowerCase().trim()
      const command = this.commands.find(cmd => (cmd.name === aliase) || cmd.aliases.includes(aliase))

      if (command) {
        if (message.guild) {
          if (!message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return
          if (
            commandsChannel.length &&
            !commandsChannel.includes(message.channel.id) &&
            !message.member.hasPermission('MANAGE_GUILD')
          ) return
        }

        const context = new CommandContext({
          client: this.client,
          instancedTimestamp: now,
          usedPrefix, message, command, prefix, args, language, aliase
        })

        context.setFixedT(this.client.language.lang(language))
        command
          ._run(context, args)
          .catch((e) => this.client.console(true, (e.stack || e), 'CommandRun', command.name))
      }
    }

    if (!emited && message.guild && this.client.database) {
      const user = new SocialUtils.userWrapper(message.author, message.channel, language);
      return this.socialUtils.upsert(user);
    }
  }

  async onVoiceStateUpdate(oldMember, newMember) {
    if (!this.client.playerManager) return
    const guildPlayer = this.client.playerManager.get(newMember.guild.id)
    if (!guildPlayer) return
    setTimeout(() => guildPlayer.updateVoiceState(oldMember, newMember), 5000)
  }
}