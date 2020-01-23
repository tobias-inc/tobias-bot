module.exports = class GuildQueue extends Array {
  constructor() {
    super()
  }

  get size() {
    return this.length;
  }

  purge() {
    return this.splice(0)
  }

  shuffle() {
    return this.sort(() => Math.random() > 0.5 ? -1 : 1)
  }

  remove(index) {
    return this.splice(index, 1)[0]
  }

  removeSong(num) {
    const song = this[num - 1];

    if (song > -1) this.splice((num - 1), 1);
    return num
  }
}