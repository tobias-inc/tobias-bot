module.exports = class Loader {
  constructor(name, client) {
    this.name = name
    this.client = client
    this.critical = false
  }

  load () {
    return true
  }
}