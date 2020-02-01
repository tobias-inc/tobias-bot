const moment = require("moment");
const { Controller } = require("../");

const BONUS_INTERVAL = 24 * 60 * 60 * 1000;

class BonusCooldownError extends Error {
  constructor(lastClaim, formattedCooldown) {
    super('ALREADY_CLAIMED')
    this.lastClaim = lastClaim
    this.formattedCooldown = formattedCooldown
  }
}

class BonusController extends Controller {
  constructor(parent, client) {
    super('bonus', client, parent);
  }

  get _users() {
    return this.client.database.users
  }

  checkClaim(lastClaim) {
    return Date.now() - lastClaim < BONUS_INTERVAL;
  }

  formatClaimTime(lastClaim) {
    return moment.duration(BONUS_INTERVAL - (Date.now() - lastClaim)).format('h[h] m[m] s[s]');
  }

  async claimDaily(_user) {
    const { economy: { lastDaily } } = await this._users.findOne(_user, 'economy');

    if (this.checkClaim(lastDaily)) {
      throw new BonusCooldownError(lastDaily, this.formatClaimTime(lastDaily));
    }

    const collectedMoney = Math.ceil((Math.random() * (300 - 150)) + 150);
    await this._users.update(
      _user, { $inc: { 'economy.pocket': collectedMoney, 'economy.xp': 25 }, 'economy.lastDaily': Date.now() }
    );

    return { collectedMoney }
  }
}

module.exports = class EconomyController extends Controller {
  constructor(client) {
    super('economy', client)
    this.subcontrollers = [new BonusController(this, client)]
  }

  get _users() {
    return this.client.database.users
  }

  async transfer(_from, _to, amount) {
    const from = await this._users.findOne(_from, 'money')
    if (from.money < amount) throw new Error('NOT_ENOUGH_MONEY')
    await Promise.all([
      this._users.update(_from, { $inc: { money: -amount } }),
      this._users.update(_to, { $inc: { money: amount } })
    ])
  }

  async balance(_user) {
    const { economy: { pocket } } = await this._users.findOne(_user, 'economy');
    return pocket;
  }
}