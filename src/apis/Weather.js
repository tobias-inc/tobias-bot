const fetch = require("node-fetch");
const xml2JS = require("xml2js");
const { Wrapper } = require("../");

const xmlParser = new xml2JS.Parser({ charkey: 'C$', attrkey: 'A$', explicitArray: true });

const API_URL = 'http://weather.service.msn.com/find.aspx';

module.exports = class WeatherWrapper extends Wrapper {
  constructor() {
    super('weather')
  }

  searchLocale(locale, { lang = 'en-US', degreeType = 'F' } = {}) {
    const queryParams = {
      culture: lang,
      weadegreetype: degreeType,
      weasearchstr: encodeURIComponent(locale)
    }

    const qParams = new URLSearchParams(queryParams)
    return this.request(`?src=outlook&${qParams.toString()}`).then(async res => {
      if (res.status === 200) {
        const xmlConvertedText = await res.text();
        return new Promise(resolve => {
          xmlParser.parseString(xmlConvertedText, (err, data) => {
            if (err) return resolve([])
            const weatherData = data.weatherdata.weather
            const findError = weatherData['A$']
            const sucess = !(findError && findError.errormessage) && weatherData instanceof Array

            if (sucess) {
              const items = weatherData.map(item => {
                const { forecast, A$: location, current: getCurrent } = item
                const current = (getCurrent instanceof Array) && getCurrent[0]['A$']
                return {
                  location,
                  current: current && {
                    imageUrl: `${location.imagerelativeurl}law/${current.skycode}.gif`,
                    cityName: current.observationpoint,
                    thermalSensation: current.feelslike,
                    windSpeed: current.winddisplay,
                    ...current
                  },
                  forecast: forecast && forecast.map(f => f['A$']),
                }
              })
              resolve(items)
            } else resolve([])
          })
        })
      }
    }).catch(() => [])
  }

  request(endpoint) {
    return fetch(`${API_URL}${endpoint}`)
  }
}