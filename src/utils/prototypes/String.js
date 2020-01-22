const Prototype = require("../Prototype.js");

module.exports = class StringPrototypes extends Prototype {
  static load() {
    // capitalize

    /**
     * @returns {string}
     */
    String.prototype.capitalize = function capitalize() {
      return this.charAt(0).toUpperCase() + this.slice(1)
    }

    //

    // allReplaces

    /**
     * @param {object} replaces 
     * @returns {string} String replaced by entered values
     */
    String.prototype.allReplaces = function allReplaces(replaces) {
      let str = this

      if (!(replaces instanceof Object)) return this

      Object.entries(replaces).forEach(([k, v]) => {
        const replaceRegex = new RegExp(k, 'gi');
        str = str.replace(replaceRegex, v)
        return str
      })

      return str
    }
  }
}