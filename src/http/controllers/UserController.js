const { Router: ClientRouter } = require('../../')
const { Router } = require('express')

const EndPoints = require('../../utils/EndPoints.js')
const authenticateMiddleware = require('../middlewares/authenticate.js')

module.exports = class UserController extends ClientRouter {
  constructor (client) {
    super('users', client)
  }

  register (app) {
    const router = Router()

    router.use(authenticateMiddleware)

    router.get('/@me', async (req, res) => {
      try {
        const accessToken = req.token
        const user = await EndPoints.getUser(accessToken)
        return res.json({ user })
      } catch (e) {
        return res.status(400).json({ error: 'Bad request!' })
      }
    })

    router.get('/@me/guilds', async (req, res) => {
      try {
        const accessToken = req.token
        const guilds = await EndPoints.getGuilds(this.client, accessToken)
        return res.json({ guilds })
      } catch (e) {
        return res.status(400).json({ error: 'Bad request!' })
      }
    })

    app.use(this.path, router)
  }
}
