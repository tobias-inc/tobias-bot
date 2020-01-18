const UserParameter = require("./UserParameter.js");

const URL_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

module.exports = class MemberParameter extends UserParameter {
  static parseOptions(options = {}) {
    return {
      ...super.parseOptions(options)
    }
  }

  static parse(arg, { message }) {
    const regexResult = URL_REGEX.exec(arg);
    if (regexResult) {
      const [, url] = regexResult
      return url
    }

    const messageAttachments = message.attachments;
    if (messageAttachments.size) return messageAttachments.first().url
  }
}