const fetch = require('node-fetch')
const fileType = require('file-type')

const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const TYPES_ACCEPTED = ['png', 'jpg', 'gif']

const URL_REGEX = /^(https|http):\/\/[^\s$.?#].[^\s]*$/gm

const defVal = (o, k, d) => (typeof o[k] === 'undefined' ? d : o[k])

const fetchImage = url =>
  fetch(url)
    .then(res => res.buffer())
    .catch(() => null)

module.exports = class ImageParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      full: false,
      acceptUrl: defVal(options, 'acceptUrl', true),
      acceptAttachment: defVal(options, 'acceptAttachment', true),
      acceptBuffer: defVal(options, 'acceptBuffer', false),
      errors: {
        notAcceptUrl: 'errors:notAcceptUrl',
        notAcceptAttachment: 'errors:notAcceptAttachment'
      }
    }
  }

  static async parse (arg, { t, message }) {
    const regexResult = URL_REGEX.test(arg)
    if (regexResult) {
      if (!this.acceptUrl) throw new CommandError(t(this.errors.notAcceptUrl))

      const image = await fetchImage(arg).then(async buffer => {
        const type = await fileType.fromBuffer(buffer)
        if (
          !type ||
          !TYPES_ACCEPTED.some(t => type.ext.toLocaleLowerCase() === t)
        ) {
          return null
        }

        return this.acceptBuffer ? { buffer, url: arg } : arg
      })

      if (image) return image
    }

    const messageAttachments = message.attachments
    if (messageAttachments.size) {
      if (!this.acceptAttachment) {
        throw new Error(this.errors.notAcceptAttachment)
      }

      const image = messageAttachments.first().url

      if (this.acceptBuffer) {
        const buffer = await fetchImage(image)
        if (!buffer) throw new CommandError(t('errors:generic'))
        return { buffer, url: arg }
      }

      return image
    }
  }
}
