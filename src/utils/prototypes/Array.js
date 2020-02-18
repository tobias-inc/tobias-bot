const Prototype = require('../Prototype.js')

module.exports = class ArrayPrototypes extends Prototype {
  static load () {
    // filterArraysOfInsert

    /**
     * @param {(value:string, index:number, array:[])} call
     */
    // eslint-disable-next-line no-extend-native
    Array.prototype.filterArraysOfInsert = function (call) {
      const updateArray = []
      return this.forEach(value => {
        Array.isArray(value)
          ? updateArray.push(...value)
          : updateArray.push(value)
      }) && typeof call === 'function'
        ? updateArray.map(call)
        : updateArray
    }

    // obj

    /**
     * @param {(value:string, index:number, array:[])} call
     */
    // eslint-disable-next-line no-extend-native
    Array.prototype.obj = function (call) {
      const obj = {}
      return (
        this.map(typeof call === 'function' ? call : v => v).map(
          ([k, v]) => (obj[k] = v)
        ) && obj
      )
    }

    // callbackValue

    /**
     * @param {Function} call Respective function a received value.
     */
    // eslint-disable-next-line no-extend-native
    Array.prototype.callbackValue = function (call) {
      if (typeof call !== 'function') {
        throw new TypeError(`${call} is not a function`)
      }
      return Promise.all(this.map(value => call(value)))
    }

    //
  }
}
