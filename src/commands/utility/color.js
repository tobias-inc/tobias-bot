const { Command, ClientEmbed, Constants } = require('../../')

const rgbToHSL = (red, green, blue) => {
  const r = red / 255
  const g = green / 255
  const b = blue / 255

  const max = Math.max(r, g, b); const min = Math.min(r, g, b)
  let h; let s; let l = (max + min) / 2

  // eslint-disable-next-line eqeqeq
  if (max == min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return { hue: h, saturation: s, lightness: l }
}
const resolveColor = input => {
  if (input.startsWith('#')) input = input.substr(1)
  if (input.length === 3) input = input.split('').map(c => c + c).join('')

  const hex = input
  const [red, green, blue] = [hex.substr(0, 2), hex.substr(2, 2), hex.substr(4, 2)]
    .map(value => parseInt(value, 16))
  const { hue, saturation, lightness } = rgbToHSL(red, green, blue)

  return { hex, red, green, blue, hue, saturation, lightness }
}

module.exports = class Color extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'color',
      category: 'utility',
      aliases: ['cor', 'rgb'],
      utils: {
        parameters: [
          {
            type: 'string',
            full: true,
            missingError: 'commands:color.args'
          }
        ]
      }
    })
  }

  async run ({ channel, t, author, args }) {
    const embed = new ClientEmbed(author)

    if (!/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(args[0])) {
      channel.send(
        embed
          .setDescription(t('commands:color.format'))
          .setColor(Constants.ERROR_COLOR)
      )
      return
    }

    const color = resolveColor(args[0])

    channel.send(
      embed
        .setDescription(`Hex: \`#${color.hex}\`\nRGB: \`${color.red}, ${color.green}, ${color.blue}\`\nHSL: \`${color.hue}, ${color.saturation}, ${color.lightness}\``)
        .setImage(`http://placehold.it/500/${color.hex}/${color.hex}`)
        .setColor(`${color.hex}`)
    )
  }
}
