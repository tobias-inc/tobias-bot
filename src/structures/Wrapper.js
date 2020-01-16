module.exports = class Wrapper {
  constructor(name) {
    this.name = name
    this.envVars = []
  }

  load() {
    return this
  }
}