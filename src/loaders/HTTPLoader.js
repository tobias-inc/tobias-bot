const { Loader, FileUtils, Router } = require("../");
const authorizationMiddleware = require('../http/middlewares/needAuthorization.js');

const express = require("express");

const chalk = require("chalk");
const cors = require("cors");
const morgan = require("morgan");

module.exports = class HTTPLoader extends Loader {
  constructor(client) {
    super('HTTPLoader', client)

    this.routes = []
    this.express = express()
  }

  async start() {
    this.client.express = this.loadServer()
    this.client.routes = await this.loadRoutes()
    return true
  }

  loadServer() {
    const PORT = process.env.PORT || 5000

    this.express
      .use(cors())
      .use(morgan(`${chalk.cyan('[HTTP]')} ${chalk.green(':method :url - IP :remote-addr - Code :status - Size :res[content-length] B - Handled in :response-time ms')}`))
      .use(express.json())
      .use(authorizationMiddleware)
      .listen(PORT, () => this.client.console(false, `Operando na Porta: "${PORT}"`, this.name, 'LISTEN'));

    return this.express
  }

  loadRoutes() {
    return FileUtils
      .requireDirectory(
        'src/http/controllers',
        this.validateRouter.bind(this),
        (e, file) => this.client.console(true, (e.stack || e), this.name, file)
      )
      .then(() => this.routes)
  }

  validateRouter({ file, required: router }) {
    if (router.prototype instanceof Router) {
      const Router = new router(this.client)
      this.routes[Router.name] = Router.load()
    } else {
      this.client.console(true, 'Not Router!', this.name, file);
    }
    return true
  }
}