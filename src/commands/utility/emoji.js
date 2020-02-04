const { 
    Command,
    Discord = require("discord.js"), 
    Attachment = Discord.Attachment,
    ErrorCommand 
} = require("../..");

module.exports = class AddEmoji extends Command {
    constructor(client, path) {
        super(client, path, {
            name: 'addemoji',
            category: 'utility',
            aliases: ['adicionaremoji'],
        })
    }

    async run({ channel, guild, message, args }, t) {
       let  a = Discord.Util.parseEmoji(args[0]) || message.guild.emojis.find(emoji => emoji.name === args.join(" "))
        let emojo = await  this.client.guilds.get(guild).emojis.get(a.id)

        try {

        let type = emojo.animated ? '.gif' : '.png'
        let emoji = new Attachment(emojo.url, emojo.name + type);
        channel.send(`\`${emojo.name}\``, emoji)  

        } catch (err) {
            throw new ErrorCommand(err)
        }
    }
}
