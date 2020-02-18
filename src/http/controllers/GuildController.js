const { Router: ClientRouter } = require('../../')
const { Router } = require('express')

const authenticateMiddleware = require('../middlewares/authenticate.js')
const handleGuildMiddleware = require('../middlewares/handleGuild.js')

module.exports = class WebController extends ClientRouter {
  constructor (client) {
    super('guilds', client)
  }

  register (app) {
    const router = Router()

    router.use(authenticateMiddleware)

    router.get('/:guildId', handleGuildMiddleware(this), async (req, res) => {
      try {
        const guild = req.guild

        const { prefix: prefixM, language: languageM } = this.client.modules
        const prefix = await prefixM.retrieveValue(guild.id, 'prefix')
        const language = await languageM.retrieveValue(guild.id, 'language')
        const {
          commandsChannel,
          systemsConfigurable,
          systemsDisabled
        } = await this.client.database.guilds.findOne(guild.id)

        const { id, name, icon, features } = guild
        return res.json({
          guild: { id, name, icon, features },
          info: {
            commandsChannel,
            systemsConfigurable,
            systemsDisabled,
            prefix,
            language
          }
        })
      } catch (e) {
        return res.status(400).json({ error: 'Bad request!' })
      }
    })

    router.post(
      '/general/:guildId',
      handleGuildMiddleware(this),
      async (req, res) => {
        try {
          const guild = req.guild
          const { prefix, language } = req.body
          if (!prefix || !language) {
            return res.status(400).json({ error: 'Bad request!' })
          }

          const { prefix: prefixM, language: languageM } = this.client.modules
          if (prefix) await prefixM.updateValues(guild.id, { prefix })
          if (language) {
            await languageM.updateValues(guild.id, {
              language: language.toLowerCase()
            })
          }

          return res.json({ ok: true })
        } catch (e) {
          console.log(e)
          return res.status(400).json({ error: 'Bad request!' })
        }
      }
    )

    app.use(this.path, router)
  }
}
