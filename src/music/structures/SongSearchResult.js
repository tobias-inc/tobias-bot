module.exports = class SongSearchResult {
  constructor(tryAgain = true, loadTime) {
    this.tryAgain = tryAgain
    this.loadTime = loadTime
  }

  async setResult(result) {
    if (result) result.loadTime = this.loadTime
    this.result = await result
    return this
  }

  static async from(result, tryAgain = true) {
    const now = Date.now()
    result = await result

    const searchResult = new this(tryAgain, Date.now() - now)
    return searchResult.setResult(result)
  }
}