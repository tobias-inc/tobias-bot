const { Loader, FileUtils, Router } = require("../");
const express = require("express");
const bodyParser = require("body-parser");

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
      .use(bodyParser.json())
      .unsubscribe(bodyParser.urlencoded({ extended: true }))
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