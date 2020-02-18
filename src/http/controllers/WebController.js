const { Router: ClientRouter } = require('../../')
const { Router } = require('express')
const jwt = require('jsonwebtoken')

const EndPoints = require('../../utils/EndPoints.js')

module.exports = class WebController extends ClientRouter {
  constructor (client) {
    super('web', client)
  }

  register (app) {
    const router = Router()

    router.get('/auth', async (req, res) => {
      const { code } = req.query
      if (!code) return res.status(400).json({ error: 'No code provided!' })

      try {
        const {
          access_token: accessToken,
          expires_in: expiresIn,
          refresh_token: refreshToken,
          token_type: tokenType
        } = await EndPoints.getToken(code)

        const user = await EndPoints.getUser(accessToken)
        return res.json({
          token: jwt.sign(
            {
              accessToken,
              refreshToken,
              expiresIn,
              tokenType,
              userId: user.id
            },
            process.env.JWT_SECRET
          ),
          user
        })
      } catch (e) {
        return res.status(400).json({ error: 'Invalid code!' })
      }
    })

    app.use(this.path, router)
  }
}
