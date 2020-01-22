const { Router: ClientRouter } = require("../../");
const { Router } = require("express");

module.exports = class CommandController extends ClientRouter {
  constructor(client) {
    super('command', client)
  }

  register(app) {
    const router = Router()
    const t = this.client.language.lang('pt-BR')

    router.get('/', (req, res) => {
      const commands = this.client.commands.map(command => command.asJSON())
      return res.json({ commands })
    })

    router.get('/:name', (req, res) => {
      const name = req.params.name
      const command = this.client.commands.find(c => c.name === name.toLocaleLowerCase() || (c.aliases.includes(name)))

      if (!command) return res.status(400).json()
      return res.json({ command: command.asJSON(t) })
    })

    return app.use(this.path, router)
  }
}