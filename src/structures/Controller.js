module.exports = class Controller {
  constructor(name, client, parent) {
    this.name = name
    this.client = client

    if (parent) this.parent = parent

    this.subcontrollers = []
  }

  canLoad() {
    return true
  }

  load() {
    this.subcontrollers.forEach(subcontroller => {
      Object.defineProperty(this, subcontroller.name, { get: () => subcontroller })
    })

    return this
  }
}