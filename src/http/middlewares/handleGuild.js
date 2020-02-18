module.exports = ({ client }) => {
  return async (req, res, next) => {
    const { guildId } = req.params
    if (!guildId) {
      return res.status(400).json({ ok: false, error: 'Guild id no provided!' })
    }

    const userId = req.userId
    const guild = client.guilds.get(guildId)
    if (!guild || !guild.members.has(userId)) {
      return res.status(400).json({ error: 'Invalid guild id!' })
    }

    req.guild = guild
    next()
  }
}
