const { PlayerManager, Status, Listener } = require("../../");

const PRESENCE_TYPES = Object.keys(Status);
const PRESENCE_INTERVAL = 60 * 1000;

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
  constructor(client) {
    super(client)
    this.events = ['ready', 'error']
  }

  replaceInformations(expr = '@{client} help') {
    const { guilds, users, user, playerManager } = this.client;
    return expr
      .replace('{guilds}', guilds.size)
      .replace('{users}', users.size)
      .replace('{client}', user.username)
      .replace('{prefix}', process.env.PREFIX)
      .replace('{musicServers}', playerManager ? playerManager.size : 0)
  }

  async onReady() {
    try {
      const nodes = JSON.parse(process.env.LAVALINK_NODES);
      if (!Array.isArray(nodes)) throw new Error('PARSE_ERROR')
      this.client.playerManager = new PlayerManager(this.client, nodes, {
        user: this.client.user.id,
        shards: 1
      })
      this.client.console(false, 'Lavalink connection established!', 'Ready', "Music")
    } catch (e) {
      this.client.console(true, 'PFailed to establish Lavalink connection - Failed to parse LAVALINK_NODES environment variable', 'Ready', 'Music')
    }

    const updateStatus = () => {
      const presenceType = PRESENCE_TYPES.sort(() => Math.random() > 0.5 ? -1 : 1)[0];
      const presence = Status[presenceType][Math.floor(Math.random() * Status[presenceType].length)];
      this.client.user.setPresence(parseStatus(presenceType, this.replaceInformations(presence)))
    }
    setInterval(updateStatus, PRESENCE_INTERVAL)
    return updateStatus()
  }

  onError(err) {
    console.log(err)
    process.exit(1)
  }
}