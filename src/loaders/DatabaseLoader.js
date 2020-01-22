const { Loader } = require("../");
const MongoDB = require("../database/MongoDB.js");

module.exports = class DatabaseLoader extends Loader {
  constructor(client) {
    super('DatabaseLoader', client)
    this.database = new MongoDB({
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  async start() {
    this.client.database = await this.database.connect().then(() => this.database)
    return true
  }
}