const { Client } = require('discord.js')
const moment = require('moment')

const loaders = require('./loaders')
const { Loader } = require('./')

const getDate = () => moment.locale('pt-BR') && moment().format('lll')

module.exports = class TobiasClient extends Client {
  constructor (config) {
    super(config)

    this.commands = []
    this.database = null
    this.language = null

    this.loadSystem()
  }

  login (token = process.env.DISCORD_TOKEN) {
    return super.login(token).catch(e => {
      this.console(true, e.stack || e, 'LOGIN')
      process.exit(1)
    })
  }

  async loadSystem () {
    for (const name in loaders) {
      if (loaders[name].prototype instanceof Loader) {
        const loader = new loaders[name](this)
        let success = false
        try {
          success = await loader.start()
          this.console(false, 'Was successfully loaded!', 'LoaderSystem', name)
        } catch (e) {
          this.console(true, e.stack || e, 'LoaderSystem', name)
        } finally {
          if (!success && loader.critical) process.exit(1)
        }
      } else {
        this.console(true, 'Not Loader!', 'LoaderSystem', name)
      }
    }
  }

  console (err, msg, ...nodes) {
    const tag = err ? ' \x1b[31m[ERROR]\x1b[0m' : ''
    const send = `\x1b[32m[${getDate()}]\x1b[0m${tag} ${
      nodes.length
        ? `${nodes.map(n => `\x1b[34m[${n}]\x1b[0m`).join(' ')} ${msg}`
        : msg
    }`
    console.log(send)
  }
}
