/* eslint-disable no-unused-vars */
const { PlayerManager, Status, Listener, Constants } = require('../../')

const PRESENCE_TYPES = Object.keys(Status)
const PRESENCE_INTERVAL = 60 * 1000

const parseStatus = (type, name) => {
  return {
    status: 'online',
    clientStatus: { desktop: 'online' },
    userID: '539853186572222464',
    activities: { name: name, url: 'https://www.twitch.tv/asynchronous301', type: type }
  }
}
module.exports = class WebSocketResponses extends Listener {
  constructor (client) {
    super(client)
    this.events = ['ready', 'error']
  }

  replaceInformations (expr = '@{client} help') {
    const { guilds, users, user, playerManager } = this.client
    return expr
      .replace('{guilds}', guilds.size)
      .replace('{users}', users.size)
      .replace('{client}', user.username)
      .replace('{prefix}', Constants.DEFAULT_PREFIX)
      .replace('{musicServers}', playerManager ? playerManager.size : 0)
  }

  async parseNodesErrors () {
    this.client.playerManager.nodes.forEach(node => {
      const disabledListeners = ['error', 'close']

      disabledListeners.forEach(name => {
        const listeners = node.ws.listeners(name)
        listeners.forEach(listener => node.ws.removeListener(name, listener))
        node.ws.on(name, () => {})
      })
    })

    return true
  }

  async onReady () {
    try {
      const nodes = JSON.parse(process.env.LAVALINK_NODES)
      if (!Array.isArray(nodes)) throw new Error('PARSE_ERROR')

      this.client.playerManager = new PlayerManager(this.client, nodes, {
        user: this.client.user.id,
        shards: 1
      })
      this.parseNodesErrors().then(() =>
        this.client.console(
          false,
          'Lavalink connection established!',
          'Ready',
          'Music'
        )
      )
    } catch (e) {
      this.client.console(
        true,
        'Failed to establish Lavalink connection - Failed to parse LAVALINK_NODES environment variable',
        'Ready',
        'No Music'
      )
    }

    const updateStatus = () => {
      const presenceType = PRESENCE_TYPES.chooseTheSorted()
      const presence = Status[presenceType].chooseTheSorted()
      this.client.user.setActivity(
        parseStatus(presenceType.toString(), this.replaceInformations(presence).toString())
      )
    }

    setInterval(updateStatus, PRESENCE_INTERVAL)
    return updateStatus()
  }

  onError (err) {
    console.log(err.stack || err)
    process.exit(1)
  }
}
