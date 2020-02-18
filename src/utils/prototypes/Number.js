const Prototype = require('../Prototype.js')
const FormatNumber = require('../FormatNumber.js')

module.exports = class NumberPrototypes extends Prototype {
  static load () {
    // localeNumber

    /**
     * @param {string} lang Language code.
     * @returns {number} Respective number in locale inserted.
     */
    // eslint-disable-next-line no-extend-native
    Number.prototype.localeNumber = function (lang) {
      return FormatNumber.localeNumber(this, lang)
    }

    //
  }
}
