const { EventEmitter } = require("events");

const KEY_SIZE = 20;

const getRandomKey = () => {
  const arr = [];
  for (let i = 0; i < KEY_SIZE; i++) arr.push(Math.floor(Math.random() * 9));
  return arr.join('');
}

module.exports = class Queue extends EventEmitter {
  constructor(options) {
    super()

    this.queue = new Map()

    if (options.globalFunction)
      this.globalFunction = options.globalFunction;
    else
      return;

    this.on('added', (key, params) => {
      if (this.queue.size === 1) this.execute(key, params)
    })

    this.on('deleted', () => {
      const newValue = this.queue.size && this.first();
      if (newValue) this.execute(newValue.key, newValue.value)
    })
  }

  first() {
    const key = this.queue.keys().next().value;
    return { value: this.queue.get(key), key };
  }

  add(params) {
    if (!params) return;

    const key = getRandomKey();

    this.queue.set(key, params);
    return this.emit('added', key, params);
  }

  remove(key) {
    if (key && this.has(key)) {
      this.queue.delete(key);
      return this.emit('deleted', key);
    }
  }

  has(key) {
    return this.queue.has(key);
  }

  async execute(key, parameters) {
    const result = await this
      .globalFunction(...parameters)
      .then(r => r);

    setTimeout(() => this.remove(key), 500);
    return result
  }
}