const Parameter = require("./Parameter.js");
const CommandError = require("../../CommandError.js");

const URL_REGEX = /^(https|http):\/\/[^\s$.?#].[^\s]*$/gm

const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]

module.exports = class ImageParameter extends Parameter {
  static parseOptions(options = {}) {
    return {
      ...super.parseOptions(options),
      acceptUrl: defVal(options, 'acceptUrl', true),
      acceptAttachment: defVal(options, 'acceptAttachment', true),
      errors: {
        notAcceptUrl: 'errors:notAcceptUrl',
        notAcceptAttachment: 'errors:notAcceptAttachment'
      }
    }
  }

  static parse(arg, { message, args, t }) {
    const regexResult = URL_REGEX.test(arg);
    if (regexResult) {
      if (!this.acceptUrl) throw new CommandError(t(this.errors.notAcceptUrl))
      const url = args.find(u => URL_REGEX.test(u))
      return url
    }

    const messageAttachments = message.attachments;
    if (messageAttachments.size) {
      if (!this.acceptAttachment) throw new Error(this.errors.notAcceptAttachment)
      return messageAttachments.first().url
    }
  }
}