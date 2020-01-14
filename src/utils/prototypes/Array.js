const Prototype = require("../Prototype.js");

module.exports = class ArrayPrototypes extends Prototype {
  static load() {
    // filterArraysOfInsert

    /**
     * @param {(value:string, index:number, array:[])} call
     */
    Array.prototype.filterArraysOfInsert = function filterArraysOfInsert(call) {
      const updateArray = []
      return this.forEach((value) => {
        Array.isArray(value) ? updateArray.push(...value) : updateArray.push(value)
      }) && typeof call === 'function' ? updateArray.map(call) : updateArray
    }

    // obj

    /**
     * @param {(value:string, index:number, array:[])} call
     */
    Array.prototype.obj = function obj(call) {
      const obj = {}
      return this
        .map(typeof call === 'function' ? call : (v) => v)
        .map(([k, v]) => obj[k] = v) && obj
    }

    // callbackValue

    /**
     * @param {Function} call Respective function a received value.
     */
    Array.prototype.callbackValue = async function callbackValue(call) {
      if (typeof call !== 'function') throw new TypeError(`${call} is not a function`);
      return Promise.all(this.map(value => call(value)))
    }

    //
  }
}