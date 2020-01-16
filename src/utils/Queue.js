const { EventEmitter } = require("events");

const KEY_SIZE = 20;

const getRandomKey = () => {
  const arr = [];
  for (let i = 0; i < KEY_SIZE; i++) arr.push(Math.floor(Math.random() * 9));
  return arr.join('');
}

module.exports = class Queue extends EventEmitter {
  constructor(options = {}) {
    super()

    Object.defineProperty(this, 'queue', {
      value: new Map()
    })

    this.queueDelay = typeof options.delay === 'number' && options.delay || 500;
    this.randomKey = options.randomKey;

    if (options.globalFunction) {
      this.globalFunction = options.globalFunction;

      this.on('added', (key, params) => {
        if (this.queue.size === 1) this.execute(key, params)
      })

      this.on('deleted', () => {
        const newValue = this.queue.size && this.first();
        if (newValue) this.execute(newValue.key, newValue.value)
      })
    }
  }

  keys() {
    return this.queue.keys()
  }

  first() {
    const key = this.queue.keys().next().value;
    return { value: this.queue.get(key), key };
  }

  add({ params, key: identify } = {}) {
    if (!params || (!this.randomKey && !identify)) return;

    const key = this.randomKey && !identify ? getRandomKey() : identify;
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

    setTimeout(() => this.remove(key), this.queueDelay);
    return result
  }
}