module.exports = {
  XPtoNextLevel: (level = 1) => 215 * (level + 1),
  replaceTime: (i18, time) => {
    const t = typeof i18 === 'function' ? i18 : null
    if (!t) throw new TypeError('CONTEXT NOT SET')
    if (typeof time !== 'string') return time

    const timeResponses = t('commons:timeResponses', { returnObjects: true });
    const reviews = ['s', 'm', 'h', 'd', 'w', 'mo', 'y']

    let timeStr = time
      .split(' ')
      .map(str => {
        const timeR = parseInt(str.replace(/[^0-9]+/, ''));
        const keyR = str.replace(/[^a-zA-Z]+/, '');

        let keyLower = keyR.toLowerCase()
        if (reviews.includes(keyLower)) {
          return str.replace(new RegExp(keyR), () => {
            const timeResponse = timeResponses.find(key => key[keyR])
            const value = timeR > 1 ? timeResponse[`${keyR}_plural`] : timeResponse[keyR]
            return ` ${value}`
          })
        }
        return str
      })

    return timeStr.join(' ')
  }
}