const { FileUtils, Prototype, Loader } = require("../");

module.exports = class PrototypesLoader extends Loader {
  constructor(client) {
    super('PrototypesLoader', client)
    this.critical = true
    this.loadedPrototypes = true
  }

  async start() {
    this.client.loadedPrototypes = await this.loadPrototypes()
    return true
  }

  loadPrototypes() {
    return FileUtils.requireDirectory(
      'src/utils/prototypes',
      this.validatePrototype.bind(this)
    ).then(() => this.loadedPrototypes)
  }

  validatePrototype({ required: prototype, file }) {
    if (prototype.prototype instanceof Prototype) {
      prototype.load()
      this.client.console(false, 'Prototype was successfully loaded!', this.name, file)
    } else {
      this.loadedPrototypes = false
      this.client.console(true, 'Not Prototype!', this.name, file)
    }
    return true
  }
}