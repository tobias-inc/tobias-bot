module.exports = class GuildQueue extends Array {
  constructor() {
    super()
  }

  get size() {
    return this.length;
  }

  push(song) {
    return super.push(song);
  }

  purge() {
    return this.splice(0)
  }

  removeSong(num) {
    const song = this[num - 1];

    if (song > -1) this.splice((num - 1), 1);
    return num
  }
}