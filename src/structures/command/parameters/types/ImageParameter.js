const Parameter = require("./Parameter.js");
const CommandError = require("../../CommandError.js");

const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]

const URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

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

  static parse(arg, { message, t }) {
    const regexResult = URL_REGEX.exec(arg);
    if (regexResult) {
      if (!this.acceptUrl) throw new CommandError(t(this.errors.notAcceptUrl))
      const [, url] = regexResult
      return url
    }

    const messageAttachments = message.attachments;
    if (messageAttachments.size) {
      if (!this.acceptAttachment) throw new Error(this.errors.notAcceptAttachment)
      return messageAttachments.first().url
    }
  }
}