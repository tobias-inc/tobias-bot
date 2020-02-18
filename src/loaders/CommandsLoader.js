const { FileUtils, Command, Loader } = require('../')

module.exports = class CommandsLoader extends Loader {
  constructor (client) {
    super('CommandsLoader', client)
    this.critical = true
    this.commands = []
    this.subcommands = []
  }

  async start () {
    this.client.commands = await this.loadCommands()
    return true
  }

  loadCommands () {
    return FileUtils.requireDirectory(
      'src/commands',
      this.validateCommand.bind(this),
      (e, file) => this.client.console(true, e.stack || e, this.name, file)
    ).then(() => {
      this.subcommands.forEach(s => {
        const refCmds = Array.isArray(s.referenceCommand)
          ? s.referenceCommand
          : [s.referenceCommand]
        const commands = this.commands.filter(({ name }) =>
          refCmds.includes(name)
        )
        if (commands.length) {
          commands.forEach(cmd => {
            const subcommandRequired = require(s.fullPath)
            const subcommand = new subcommandRequired(this.client, s.fullPath)
            subcommand.referenceCommand = cmd
            cmd.subcommands.push(subcommand)
          })
        }
      })
      return this.commands
    })
  }

  validateCommand ({ file, required, fullPath }) {
    if (required.prototype instanceof Command) {
      const command = new required(this.client, fullPath)
      if (!command.referenceCommand) this.commands.push(command)
      else this.subcommands.push(command)
    } else {
      this.client.console(true, 'Not Command!', this.name, file)
    }
    return true
  }
}
