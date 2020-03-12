const { PlayerManager, Status, Listener, Constants } = require('../../')

const PRESENCE_TYPES = Object.keys(Status)
const PRESENCE_INTERVAL = 60 * 1000

const parseStatus = (type, status) => {
  return {
    status: 'online',
    game: {
      name: status,
      url: 'https://www.twitch.tv/monstercat',
      type: type.toUpperCase()
    }
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

  parseNodesErrors () {
    this.client.playerManager.nodes.forEach(node => {
      const listeners = node.ws.listeners('error')
      listeners.forEach(listen => node.ws.removeListener('error', listen))
      node.ws.on('error', () => {})
    })
  }

  async onReady () {
    try {
      const nodes = JSON.parse(process.env.LAVALINK_NODES)
      if (!Array.isArray(nodes)) throw new Error('PARSE_ERROR')
      this.client.playerManager = new PlayerManager(this.client, nodes, {
        user: this.client.user.id,
        shards: 1
      })
      this.parseNodesErrors()
      this.client.console(
        false,
        'Lavalink connection established!',
        'Ready',
        'Music'
      )
    } catch (e) {
      this.client.console(
        true,
        'Failed to establish Lavalink connection - Failed to parse LAVALINK_NODES environment variable',
        'Ready',
        'Music'
      )
    }

    const updateStatus = () => {
      const presenceType = PRESENCE_TYPES.sort(() =>
        Math.random() > 0.5 ? -1 : 1
      )[0]
      const presence =
        Status[presenceType][
          Math.floor(Math.random() * Status[presenceType].length)
        ]
      this.client.user.setPresence(
        parseStatus(presenceType, this.replaceInformations(presence))
      )
    }
    setInterval(updateStatus, PRESENCE_INTERVAL)
    return updateStatus()
  }

  onError (err) {
    console.log(err)
    process.exit(1)
  }
}
