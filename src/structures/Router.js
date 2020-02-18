module.exports = class Router {
  constructor (name, client, parent) {
    this.name = name
    this.client = client
    this.parent = parent
    this.subroutes = []
  }

  get path () {
    return this.parent ? `/${this.parent.name}/${this.name}` : `/${this.name}`
  }

  load () {
    this.register(this.client.express)
    this.subroutes = this.subroutes.map(SubRoute => new SubRoute(this.client))
    return this
  }

  register () {}
}
