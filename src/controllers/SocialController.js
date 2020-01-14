const { Controller } = require("../");

module.exports = class SocialController extends Controller {
  constructor(client) {
    super('social', client);
  }

  canLoad() {
    return !!this.client.database
  }

  get _users() {
    return this.client.database.users
  }

  retrieveProfile (_user, projection = 'blacklisted economy') {
    return this._users.get(_user, projection)
  }

  async updateXp(_user, xp) {
    if (typeof xp !== 'number') throw new Error('The entered xp is not a number!');
    await this._users.update(_user, { $inc: { 'economy.xp': xp } });
    return { xp }
  }

  async balance(_user) {
    const { economy: { xp } } = await this._users.findOne(_user, 'economy');
    return xp;
  }
}