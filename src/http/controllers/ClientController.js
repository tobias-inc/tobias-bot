const { Router: ClientRouter } = require('../../')
const { Router } = require('express')

module.exports = class ClientController extends ClientRouter {
  constructor (client) {
    super('client', client)
  }

  register (app) {
    const router = Router()
    const t = this.client.language.lang('pt-BR')

    router.get('/commands', (req, res) => {
      const commands = this.client.commands
        .filter(command => !command.hidden)
        .map(command => command.asJSON(t))
      return res.json({ commands })
    })

    router.get('/commands/:name', (req, res) => {
      const name = req.params.name
      const command = this.client.commands.find(
        c => c.name === name.toLocaleLowerCase() || c.aliases.includes(name)
      )

      if (!command) return res.status(400).json({ error: 'Not command!' })
      return res.json({ command: command.asJSON(t) })
    })

    router.get('/languages', (req, res) => {
      const languages = this.client.language.langs.map(lang => ({
        title: lang.name(t),
        id: lang.id
      }))
      return res.json({ languages })
    })

    return app.use(this.path, router)
  }
}
