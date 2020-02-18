const Parameter = require('./Parameter.js')

module.exports = class StringFlagParameter extends Parameter {
  static parse (arg) {
    return arg
  }
}
