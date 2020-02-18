const { FileUtils, Controller, Loader } = require('../')

module.exports = class ControllersLoader extends Loader {
  constructor (client) {
    super('ControllersLoader', client)
    this.controllers = {}
  }

  async start () {
    this.client.controllers = await this.loadControllers()
    return true
  }

  loadControllers () {
    return FileUtils.requireDirectory(
      'src/controllers',
      this.validateController.bind(this)
    ).then(() => this.controllers)
  }

  validateController ({ file, required }) {
    if (required.prototype instanceof Controller) {
      const controller = new required(this.client)
      if (controller.canLoad() !== true) { throw new Error('Controller needs another component to load!') }

      this.controllers[controller.name] = controller.load()
    } else {
      this.client.console(true, 'Not Controller!', this.name, file)
    }
    return true
  }
}
