const Prototype = require("../Prototype.js");
const FormatNumber = require("../FormatNumber.js");

module.exports = class NumberPrototypes extends Prototype {
  static load() {
    // localeNumber

    /**
     * @param {string} lang Language code.
     * @returns {number} Respective number in locale inserted.
     */
    Number.prototype.localeNumber = function localeNumber(lang) {
      return FormatNumber.localeNumber(this, lang);
    }

    //
  }
}