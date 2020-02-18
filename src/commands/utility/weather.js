const { Command, ClientEmbed, Constants } = require('../../')

module.exports = class Weather extends Command {
  constructor (client, path) {
    super(client, path, {
      name: 'weather',
      category: 'utility',
      aliases: ['tempo'],
      utils: {
        requirements: { apis: ['weather'] },
        parameters: [
          {
            type: 'string',
            full: true,
            missingError: 'commands:weather.cityNotEntered'
          }
        ]
      }
    })
  }

  async run ({ t, author, channel, language: lang }, city) {
    const embed = new ClientEmbed(author)
    const [cityWeather] = await this.client.apis.weather.searchLocale(city, {
      lang,
      degreeType: 'C'
    })

    if (cityWeather) {
      const {
        location: { timezone },
        current: {
          day,
          humidity,
          temperature,
          imageUrl,
          cityName,
          thermalSensation,
          windSpeed
        }
      } = cityWeather

      embed
        .setTitle(cityName)
        .setThumbnail(imageUrl)
        .addField(t('commands:weather.timezone'), `UTC ${timezone}`, true)
        .addField(t('commands:weather.temperature'), `${temperature} ºC`, true)
        .addField(
          t('commands:weather.thermalSensation'),
          `${thermalSensation} ºC`,
          true
        )
        .addField(t('commands:weather.wind'), windSpeed, true)
        .addField(t('commands:weather.humidity'), `${humidity}%`, true)
        .addField(t('commands:weather.day'), day.capitalize(), true)
    } else {
      embed
        .setTitle(t('commands:weather.cityNotFound'))
        .setColor(Constants.ERROR_COLOR)
    }

    channel.send(embed)
  }
}
