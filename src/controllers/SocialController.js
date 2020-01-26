const moment = require("moment");
const { Controller, Utils } = require("../");

const REP_INTERVAL = 24 * 60 * 60 * 1000;

class RepCooldownError extends Error {
  constructor(lastClaim, formattedCooldown) {
    super('ALREADY_DONATE')
    this.lastClaim = lastClaim
    this.formattedCooldown = formattedCooldown
  }
}

class RepController extends Controller {
  constructor(parent, client) {
    super('rep', client, parent);
  }

  get _users() {
    return this.client.database.users
  }

  checkDonation(lastDonation) {
    return Date.now() - lastDonation < REP_INTERVAL;
  }

  formatDonationTime(lastDonation) {
    return moment.duration(REP_INTERVAL - (Date.now() - lastDonation)).format('h[h] m[m] s[s]');
  }

  async donationRep(_user) {
    const { economy: { lastRep, rep } } = await this._users.findOne(_user, 'economy');

    if (this.checkDonation(lastRep)) {
      throw new RepCooldownError(lastRep, this.formatDonationTime(lastRep));
    }

    await this._users.update(
      _user, { $inc: { 'economy.rep': 1 }, 'economy.lastRep': Date.now() }
    );

    return { reps: rep + 1 };
  }
}

module.exports = class SocialController extends Controller {
  constructor(client) {
    super('social', client);
    this.subcontrollers = [new RepController(this, client)]
  }

  canLoad() {
    return !!this.client.database
  }

  get _users() {
    return this.client.database.users
  }

  retrieveProfile(_user, projection = 'blacklisted economy') {
    return this._users.get(_user, projection)
  }

  balance(_user) {
    return this._users.findOne(_user, 'economy').then(doc => doc.economy.xp);
  }

  setFavoriteColor(_user, favColor) {
    return this._users.update(_user, { 'economy.favColor': favColor })
  }

  setPersonalText(_user, text) {
    return this._users.update(_user, { 'economy.personalText': text })
  }

  async setBackground(_user, image) {
    const { data: { error, link } } = await this.client.apis.imgur.postImage(image);

    if (error) throw new Error('URL_INVALID');

    await this._users.update(_user, { 'economy.background': link });
    return { image: link }
  }

  getRank(_user) {
    return this._users
      .findAll(['type', 'economy.xp'], { sort: { 'economy.xp': -1 } })
      .then(users => {
        const index = users.findIndex(u => u._id === _user);
        return index !== -1 ? index + 1 : users.length;
      })
  }

  async currentXp(_user) {
    const { economy: { xp, levels, level } } = _user instanceof Object ? _user : await this._users.findOne(_user);
    const current = levels.length > 1
      ? xp - levels
        .slice(0, levels.length - 1)
        .map(r => r.maxXp)
        .reduce((a, b) => a + b)
      : xp;

    return { current, next: Utils.XPtoNextLevel(level), level }
  }
}