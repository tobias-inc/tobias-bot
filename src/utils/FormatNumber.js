const Intl = require("intl");
Intl.__disableRegExpRestore();

module.exports = class FormatNumber {
  static localeNumber(number, lang) {
    return new Intl.NumberFormat(lang).format(number);
  }
}