const request = require('request')
const {
  createCanvas,
  registerFont,
  loadImage,
  Context2d,
  Image
} = require('canvas')

const Constants = require('../Constants.js')
const FileUtils = require('../FileUtils.js')

const URLtoBuffer = function (url) {
  return new Promise((resolve, reject) => {
    request.get({ url, encoding: null, isBuffer: true }, (err, res, body) => {
      if (!err && res && res.statusCode === 200 && body) resolve(body)
      else reject(err || res)
    })
  })
}

const ALIGN = {
  TOP_LEFT: 1,
  TOP_CENTER: 2,
  TOP_RIGHT: 3,
  CENTER_RIGHT: 4,
  BOTTOM_RIGHT: 5,
  BOTTOM_CENTER: 6,
  BOTTOM_LEFT: 7,
  CENTER_LEFT: 8,
  CENTER: 9
}

module.exports = class CanvasUtils {
  static initializeHelpers () {
    const self = this

    registerFont('src/assets/fonts/BebasNeueRegular.ttf', {
      family: 'Bebas Neue'
    })
    registerFont('src/assets/fonts/LemonMilk.otf', { family: 'Lemon Milk' })
    registerFont('src/assets/fonts/LemonMilkItalic.otf', {
      family: 'Lemon Milk',
      style: 'italic'
    })
    registerFont('src/assets/fonts/LemonMilkBold.otf', {
      family: 'Lemon Milk Bold'
    })
    registerFont('src/assets/fonts/LemonMilkBold-Italic.otf', {
      family: 'Lemon Milk Bold',
      style: 'italic'
    })
    registerFont('src/assets/fonts/LemonMilkLight.otf', {
      family: 'Lemon Milk Light'
    })
    registerFont('src/assets/fonts/LemonMilkLight-Italic.otf', {
      family: 'Lemon Milk Light',
      style: 'italic'
    })
    registerFont('src/assets/fonts/Montserrat-Thin.otf', {
      family: 'Montserrat Thin'
    })
    registerFont('src/assets/fonts/Montserrat-ThinItalic.otf', {
      family: 'Montserrat Thin',
      style: 'italic'
    })
    registerFont('src/assets/fonts/Montserrat-Light.otf', {
      family: 'Montserrat Light'
    })
    registerFont('src/assets/fonts/Montserrat-LightItalic.otf', {
      family: 'Montserrat Light',
      style: 'italic'
    })
    registerFont('src/assets/fonts/Montserrat-Regular.otf', {
      family: 'Montserrat'
    })
    registerFont('src/assets/fonts/Montserrat-Italic.otf', {
      family: 'Montserrat',
      style: 'italic'
    })
    registerFont('src/assets/fonts/Montserrat-Medium.otf', {
      family: 'Montserrat Medium'
    })
    registerFont('src/assets/fonts/Montserrat-MediumItalic.otf', {
      family: 'Montserrat Medium',
      style: 'italic'
    })
    registerFont('src/assets/fonts/Montserrat-SemiBold.otf', {
      family: 'Montserrat SemiBold'
    })
    registerFont('src/assets/fonts/Montserrat-SemiBoldItalic.otf', {
      family: 'Montserrat SemiBold',
      style: 'italic'
    })
    registerFont('src/assets/fonts/Montserrat-Bold.otf', {
      family: 'Montserrat',
      weight: 'bold'
    })
    registerFont('src/assets/fonts/Montserrat-BoldItalic.otf', {
      family: 'Montserrat',
      style: 'italic',
      weight: 'bold'
    })
    registerFont('src/assets/fonts/Montserrat-ExtraBold.otf', {
      family: 'Montserrat ExtraBold'
    })
    registerFont('src/assets/fonts/Montserrat-ExtraBoldItalic.otf', {
      family: 'Montserrat ExtraBold',
      style: 'italic'
    })
    registerFont('src/assets/fonts/Montserrat-Black.otf', {
      family: 'Montserrat Black'
    })
    registerFont('src/assets/fonts/Montserrat-BlackItalic.otf', {
      family: 'Montserrat Black',
      style: 'italic'
    })

    Image.from = async (src, errorSource) => {
      const defaultSource = Constants.DEFAULT_BACKGROUND
      try {
        src = src || defaultSource
        const imageLoaded = await loadImage(src)
        return imageLoaded
      } catch (e) {
        if (errorSource) return Image.from(errorSource)
        return loadImage(defaultSource)
      }
    }

    Image.buffer = (url, localFile = false) =>
      localFile ? FileUtils.readFile(url) : URLtoBuffer(url)

    Context2d.prototype.printAt = function (
      text,
      x,
      y,
      lineHeight,
      fitWidth = x + y,
      font = '16px "Montserrat"'
    ) {
      const completeWidth = fitWidth * 1.5
      const words = self
        .splitText(text, completeWidth, { font, ctx: this })
        .split(' ')
      const wordsRenders = []

      let inX = x
      let inHeight = y
      for (const word of words) {
        const { width, height } = self.measureText(this, font, `${word} `)
        if (inX + width > completeWidth) {
          inHeight += lineHeight
          inX = x
        }
        wordsRenders.push({ x: inX, y: inHeight, word, width, height })
        inX = inX + width
      }

      wordsRenders.forEach(word => {
        const { x, y, word: text } = word
        this.fillText(text, x, y)
      })

      const wordMaxHeight = wordsRenders
        .map(word => word.height)
        .sort((a, b) => a + b)[0]
      return inHeight + wordMaxHeight
    }

    Context2d.prototype.roundImage = function (img, x, y, w, h, r) {
      this.drawImage(this.roundImageCanvas(img, w, h, r), x, y, w, h)
      return this
    }

    Context2d.prototype.roundFill = function (x, y, w, h, r = w * 0.5) {
      this.beginPath()
      this.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2, true)
      this.closePath()
      this.fill()

      return this
    }

    Context2d.prototype.roundImageCanvas = function (
      img,
      w = img.width,
      h = img.height,
      r = w * 0.5
    ) {
      const canvas = createCanvas(w, h)
      const ctx = canvas.getContext('2d')

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(img, 0, 0, w, h)

      ctx.fillStyle = '#fff'
      ctx.globalCompositeOperation = 'destination-in'
      ctx.beginPath()
      ctx.arc(w * 0.5, h * 0.5, r, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.fill()

      return canvas
    }

    Context2d.prototype.circle = function (
      x,
      y,
      r,
      a1,
      a2,
      fill = true,
      stroke = false
    ) {
      this.beginPath()
      this.arc(x, y, r, a1, a2, true)
      this.closePath()
      if (fill) this.fill()
      if (stroke) this.stroke()
      return this
    }

    Context2d.prototype.roundRect = function (
      x,
      y,
      width,
      height,
      radius,
      fill,
      stroke
    ) {
      let cornerRadius = {
        upperLeft: 0,
        upperRight: 0,
        lowerLeft: 0,
        lowerRight: 0
      }
      if (typeof radius === 'object') {
        cornerRadius = Object.assign(cornerRadius, radius)
      } else if (typeof radius === 'number') {
        cornerRadius = {
          upperLeft: radius,
          upperRight: radius,
          lowerLeft: radius,
          lowerRight: radius
        }
      }

      this.beginPath()
      this.moveTo(x + cornerRadius.upperLeft, y)
      this.lineTo(x + width - cornerRadius.upperRight, y)
      this.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + cornerRadius.upperRight
      )
      this.lineTo(x + width, y + height - cornerRadius.lowerRight)
      this.quadraticCurveTo(
        x + width,
        y + height,
        x + width - cornerRadius.lowerRight,
        y + height
      )
      this.lineTo(x + cornerRadius.lowerLeft, y + height)
      this.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - cornerRadius.lowerLeft
      )
      this.lineTo(x, y + cornerRadius.upperLeft)
      this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y)
      this.closePath()
      if (stroke) this.stroke()
      if (fill) this.fill()
      return this
    }

    Context2d.prototype.write = function (
      text,
      x,
      y,
      font = '12px "Bebas Neue"',
      align = ALIGN.BOTTOM_LEFT
    ) {
      this.font = font
      const { width, height } = self.measureText(this, font, text)
      const { x: realX, y: realY } = self.resolveAlign(
        x,
        y,
        width,
        height,
        align
      )
      this.fillText(text, realX, realY)
      return {
        leftX: realX,
        rightX: realX + width,
        bottomY: realY,
        topY: realY - height,
        centerX: realX + width * 0.5,
        centerY: realY - height * 0.5,
        width,
        height
      }
    }

    Context2d.prototype.writeParagraph = function (
      text,
      font,
      startX,
      startY,
      maxX,
      maxY,
      lineDistance = 5,
      alignment = ALIGN.TOP_LEFT
    ) {
      const lines = text.split('\n')
      let currentY = startY
      let lastWrite = null
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i]
        if (!l) continue

        const lineText = self.measureText(this, font, l)
        const height = lineText.height
        if (currentY > maxY) break

        if (startX + lineText.width <= maxX) {
          lastWrite = this.write(l, startX, currentY, font, alignment)
          alignment = ALIGN.TOP_LEFT
        } else {
          if (l.includes(' ')) {
            const words = l.split(' ')
            const maxIndex = words.findIndex((w, j) => {
              const word = words.slice(0, j + 1).join(' ')
              const wordText = self.measureText(this, font, word)
              if (startX + wordText.width <= maxX) return false
              else return true
            })
            const missingWords = words.slice(maxIndex, words.length)
            if (missingWords.length > 0) { lines.splice(i + 1, 0, missingWords.join(' ')) }
            lastWrite = this.write(
              words.slice(0, maxIndex).join(' '),
              startX,
              currentY,
              font,
              alignment
            )
            alignment = ALIGN.TOP_LEFT
          } else {
            const letters = l.split('')
            const maxIndex = letters.findIndex((w, j) => {
              const word = letters.slice(0, j + 1).join('')
              const wordText = self.measureText(this, font, word)
              if (startX + wordText.width <= maxX) return false
              else return true
            })
            lastWrite = this.write(
              letters.slice(0, maxIndex).join(''),
              startX,
              currentY,
              font,
              alignment
            )
            alignment = ALIGN.TOP_LEFT
          }
        }
        currentY += height + lineDistance
      }
      return lastWrite
    }

    Context2d.prototype.blur = function (blur) {
      const delta = 5
      const alphaLeft = 1 / (2 * Math.PI * delta * delta)
      const step = blur < 3 ? 1 : 2
      let sum = 0
      for (let y = -blur; y <= blur; y += step) {
        for (let x = -blur; x <= blur; x += step) {
          const weight =
            alphaLeft * Math.exp(-(x * x + y * y) / (2 * delta * delta))
          sum += weight
        }
      }
      for (let y = -blur; y <= blur; y += step) {
        for (let x = -blur; x <= blur; x += step) {
          this.globalAlpha =
            ((alphaLeft * Math.exp(-(x * x + y * y) / (2 * delta * delta))) /
              sum) *
            blur
          this.drawImage(this.canvas, x, y)
        }
      }
      this.globalAlpha = 1
    }

    Context2d.prototype.drawBlurredImage = function (
      image,
      blur,
      imageX,
      imageY,
      w = image.width,
      h = image.height
    ) {
      const canvas = createCanvas(w, h)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, w, h)
      ctx.blur(blur)
      this.drawImage(canvas, imageX, imageY, w, h)
    }

    Context2d.prototype.drawIcon = function (image, x, y, w, h, color, rotate) {
      const canvas = createCanvas(image.width, image.height)
      const ctx = canvas.getContext('2d')

      ctx.save()

      if (rotate) {
        const centerX = canvas.width * 0.5
        const centerY = canvas.height * 0.5
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate((rotate * Math.PI) / 180)
        ctx.translate(-centerX, -centerY)
      }

      ctx.drawImage(image, 0, 0, image.width, image.height)
      ctx.restore()

      if (color) {
        ctx.globalCompositeOperation = 'source-in'
        ctx.fillStyle = color
        ctx.fillRect(0, 0, image.width, image.height)
      }
      this.drawImage(canvas, x, y, w, h)
      return canvas
    }
  }

  static splitText (text, completeWidth, { font, ctx }) {
    const textSplited = text.split(' ').map(word => {
      const { width } = this.measureText(ctx, font, word)
      if (width > completeWidth) {
        const wordsScaped = []

        const letters = word.split('')
        const maxIndex = Math.floor(
          letters.findIndex((w, j) => {
            const word = letters.slice(0, j + 1).join('')
            const wordText = this.measureText(ctx, font, word)
            if (wordText.width <= completeWidth) return false
            else return true
          }) * 0.5
        )

        const splitTextLength = Math.floor(word.length / maxIndex)

        let inIndex = 0
        for (let i = 0; i < splitTextLength + 1; i++) {
          let max = maxIndex * (i + 1)
          if (i === splitTextLength) max = word.length
          wordsScaped.push(letters.slice(inIndex, max).join(''))
          inIndex += maxIndex
        }
        return wordsScaped.join('- ')
      }
      return word
    })
    return textSplited.join(' ')
  }

  static measureText (ctx, font, text) {
    ctx.font = font
    const measure = ctx.measureText(text)
    return {
      width: measure.width,
      height: measure.actualBoundingBoxAscent
    }
  }

  static resolveAlign (x, y, width, height, align) {
    const realCoords = { x, y }
    switch (align) {
      case ALIGN.TOP_LEFT:
        realCoords.y = y + height
        break
      case ALIGN.TOP_CENTER:
        realCoords.x = x - width * 0.5
        realCoords.y = y + height
        break
      case ALIGN.TOP_RIGHT:
        realCoords.x = x - width
        realCoords.y = y + height
        break
      case ALIGN.CENTER_RIGHT:
        realCoords.x = x - width
        realCoords.y = y + height * 0.5
        break
      case ALIGN.BOTTOM_RIGHT:
        realCoords.x = x - width
        break
      case ALIGN.BOTTOM_CENTER:
        realCoords.x = x - width * 0.5
        break
      case ALIGN.CENTER_LEFT:
        realCoords.y = y + height * 0.5
        break
      case ALIGN.CENTER:
        realCoords.x = x - width * 0.5
        realCoords.y = y + height * 0.5
        break
    }
    return realCoords
  }
}

module.exports.ALIGN = ALIGN
