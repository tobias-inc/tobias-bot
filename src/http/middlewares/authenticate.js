const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authorization =
    req.headers.authorization || req.body.token || req.query.token
  if (!authorization) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }

  const [, token] = authorization.split(' ')

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ ok: false, error: 'Unauthorized' })

    req.token = decoded.accessToken
    req.userId = decoded.userId
    next()
  })
}
