const Prototype = require("../Prototype.js");

module.exports = class StringPrototypes extends Prototype {
  static load() {
    // capitalize

    /**
     * @returns {String}
     */
    String.prototype.capitalize = function capitalize() {
      return this.charAt(0).toUpperCase() + this.slice(1)
    }

    //
  }
}