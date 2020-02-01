const { FileUtils, Listener, Loader } = require("../");

module.exports = class ListenersLoader extends Loader {
  constructor(client) {
    super('ListenersLoader', client)
    this.critical = true
  }

  start() {
    return this.loadListeners()
  }

  loadListeners() {
    return FileUtils
      .requireDirectory(
        'src/client/listeners',
        this.validateListener.bind(this)
      )
      .then(() => true)
  }

  validateListener({ file, required }) {
    if (required.prototype instanceof Listener) {
      const listener = new required(this.client);
      listener.events.forEach(event => {
        const hasFunction = listener.realEvents[event];
        if (hasFunction) {
          this.client.on(event, (...args) => listener[`on${event.capitalize()}`](...args))
          this.client.console(
            false,
            'Listener function was successfully loaded!',
            this.name,
            event.capitalize()
          )
        }
      })
    } else {
      this.client.console(true, 'Not Listener!', this.name, file);
    }
    return true
  }
}