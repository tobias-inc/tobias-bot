module.exports = class Controller {
  constructor(name, client, parent) {
    this.name = name
    this.client = client
    this.subcontrollers = []

    this.parent = parent
  }

  canLoad() {
    return !!this.client.database
  }

  load() {
    this.subcontrollers.forEach(subcontroller => {
      Object.defineProperty(this, subcontroller.name, { get: () => subcontroller })
    })

    return this
  }
}