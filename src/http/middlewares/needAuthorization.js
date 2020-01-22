module.exports = (req, res, next) => {
  const authorization = req.headers.authorization || req.query.authorization;

  if (
    !(authorization && authorization === process.env.AUTHORIZATION_TOKEN)
  ) return res.status(401).json({ ok: false, error: 'Unauthorized' })

  next()
}